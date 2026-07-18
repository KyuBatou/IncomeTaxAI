from datetime import datetime
import json
from uuid import uuid4
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.decorators.http import require_POST
from .forms import EmailCheckForm, UserDetailsForm
from django.shortcuts import get_object_or_404
from django.views.generic.edit import FormView
from django.views.generic import TemplateView
from django.http import HttpResponseForbidden
from django.shortcuts import redirect, render
from django.utils.timezone import now
from .forms import ContactMessageForm
from django.db.models import Prefetch
from django.http import JsonResponse
from django.urls import reverse_lazy
from django.contrib import messages
from login_auth.models import User
from django.views import View
from core.models import *
import razorpay


# RAZORPAY_KEY_ID = 'rzp_test_2rglicKkYHsyHk'
# RAZORPAY_KEY_SECRET = 'BcT6aw56tjo5OH62RkwWpxcq'
# RAZORPAY_KEY_ID = 'rzp_test_pOCIYbOYzrYWUK'
# RAZORPAY_KEY_SECRET = 'naQ0AQuSB0BimggKWZaeaymq'

RAZORPAY_KEY_ID = 'rzp_live_KOcogkdLbAxLEu'
RAZORPAY_KEY_SECRET = 'BUZCMpYbbWuu59Yt9p6UXpbp'

client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

def get_plan_year(selected_plans):
    # selected = [plan['year'] for plan in TblSubscription.objects.all() if plan['id'] in selected_plans]
    selected = [plan.name for plan in PricingPlan.objects.all() if plan.pk in selected_plans]
    if len(selected) > 1: return ', '.join(selected[:-1]) + f" with {selected[-1]}"
    return selected[0] if selected else ""

class IndexView(TemplateView):
    template_name = "index.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context

# class IndexView(FormView, TemplateView):
#     template_name = "index.html"
#     form_class = ContactMessageForm
#     success_url = reverse_lazy('index')

#     def get_context_data(self, **kwargs):
#         context = super().get_context_data(**kwargs)
#         context["roadmap_steps"] = RoadmapStep.objects.all()
#         context["counters"] = CounterBoard.objects.all()
#         context["services"] = Service.objects.filter(is_active=True)
#         context["faqs"] = FAQ.objects.all()
#         context["pricing_plans"] = PricingPlan.objects.prefetch_related(
#             Prefetch('features', queryset=PricingFeature.objects.only('feature_text'))
#         )
#         context["banner"] = Banner.objects.first()
#         context["legal_content"] = LegalContent.objects.all()
#         return context

#     def form_valid(self, form):
#         form.save()
#         messages.success(self.request, "Your message has been sent successfully!")
#         return super().form_valid(form)

#     def form_invalid(self, form):
#         return super().form_invalid(form)

class FaqView(TemplateView):
    template_name = "faqs.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["faqs"] = FAQ.objects.all()
        context["legal_content"] = LegalContent.objects.all()
        return context

class AboutView(TemplateView):
    template_name = "about.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["legal_content"] = LegalContent.objects.all()
        return context

class PricingView(TemplateView):
    template_name = "pricing.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["legal_content"] = LegalContent.objects.all()
        context["pricing_plans"] = PricingPlan.objects.prefetch_related(
            Prefetch('features', queryset=PricingFeature.objects.only('feature_text'))
        )
        return context

class ContactView(FormView, TemplateView):
    template_name = "contacts.html"
    form_class = ContactMessageForm
    success_url = reverse_lazy('contact')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["legal_content"] = LegalContent.objects.all()
        context['form'] = self.get_form()
        return context

    def form_valid(self, form):
        form.save()
        messages.success(self.request, "Your message has been sent successfully!")
        return super().form_valid(form)

    def form_invalid(self, form):
        return super().form_invalid(form)

class LegalDetailView(TemplateView):
    template_name = "legal_content.html"

    def get_context_data(self, **kwargs):
        slug = kwargs.get('slug')
        content = get_object_or_404(LegalContent, slug=slug)
        context = super().get_context_data(**kwargs)
        context["content"] = content
        context["legal_content"] = LegalContent.objects.all()
        return context

class SubscribeView(TemplateView):
    template_name = "subscribe.html"

    def get(self, request, *args, **kwargs):

        email_form = EmailCheckForm()
        user_form = None
        user_found = False

        email = request.GET.get("email")

        if email:
            try:
                user = User.objects.get(email=email)
                user_form = UserDetailsForm(instance=user)
                user_found = True
            except User.DoesNotExist:
                return redirect("signup")

        context = {
            "email_form": email_form,
            "user_form": user_form,
            "user_found": user_found,
            "legal_content": LegalContent.objects.all(),
            "pricing_plans": PricingPlan.objects.prefetch_related(
                Prefetch('features', queryset=PricingFeature.objects.only('feature_text'))
            )
        }

        return self.render_to_response(context)

class PlanView(TemplateView):
    template_name = "plan.html"

    def post(self, request, *args, **kwargs):
        form_data = request.POST
        context = {
            "form_data": form_data,
            "order_number": str(datetime.now().strftime("%Y%m%d%H%M%S")),
            "legal_content": LegalContent.objects.all(),
            "salesmans": User.objects.filter(is_active=True).order_by('name'),
            "pricing_plans": PricingPlan.objects.prefetch_related(
                Prefetch('features', queryset=PricingFeature.objects.only('feature_text'))
            )
        }

        return render(request, self.template_name, context)

    def get(self, request, *args, **kwargs):
        return redirect("subscribe")

class ReviewView(TemplateView):
    template_name = "review.html"

    def post(self, request, *args, **kwargs):
        form_data = request.POST
        RAZORPAY_KEY_ID = settings.RAZORPAY_KEY_ID
        RAZORPAY_KEY_SECRET = settings.RAZORPAY_KEY_SECRET
        client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

        order_data = {
            'amount': round(float(form_data['final_amount']) * 100),
            'currency': 'INR',
            'payment_capture': 1
        }
        order = client.order.create(data=order_data)

        data = TblPayment.objects.create(
            email_id=form_data['email'],
            user_id=User.objects.get(email__iexact=form_data['email']).pk,
            name=form_data['name'],
            mobile_no=form_data['mobileno'],
            company_name=form_data['company'],
            address=form_data['address'],
            legal_name=form_data['legal_name'],
            gstin=form_data['gstin'],
            booked_by_id=form_data['member'],
            product_name=form_data['plan'],
            order_number=form_data['order_number'],
            amount=form_data['amount'],
            gst='18',
            gst_amount=form_data['tax'],
            payable_amount=form_data['final_amount'],
            txnid=order['id'],
            status='Pending',
        )
        data.save()
        print(data.pk)

        context = {
            "order": order,
            "form_data": form_data,
            "order_date": datetime.now(),
            "razorpay_key": RAZORPAY_KEY_ID,
            "legal_content": LegalContent.objects.all(),
            "pricing_plan": PricingPlan.objects.get(id=form_data.get('plan', 1))
        }

        return render(request, self.template_name, context)

    def get(self, request, *args, **kwargs):
        return redirect("subscribe")


class VerifyView(View):

    def post(self, request, *args, **kwargs):

        data = json.loads(request.body)
        razorpay_payment_id = data.get("razorpay_payment_id")
        razorpay_order_id = data.get("razorpay_order_id")
        razorpay_signature = data.get("razorpay_signature")
        payment = TblPayment.objects.get(txnid=razorpay_order_id)

        client = razorpay.Client(auth=(
            settings.RAZORPAY_KEY_ID,
            settings.RAZORPAY_KEY_SECRET
        ))
        params = {
            "razorpay_order_id": razorpay_order_id,
            "razorpay_payment_id": razorpay_payment_id,
            "razorpay_signature": razorpay_signature
        }

        payment_details = client.payment.fetch(razorpay_payment_id)
        payment.txnid = payment_details.get("order_id")
        payment.bank_txnid = payment_details.get("id")
        payment.payment_mode = payment_details.get("method")
        payment.bank_name = payment_details.get("bank")
        payment.gateway_name = payment_details.get("bank")
        payment.save()

        try:
            client.utility.verify_payment_signature(params)
            payment.status = "TXN_SUCCESS"
            payment.resp_code = "01"
            payment.save()
            return JsonResponse({'status': 'success', 'message': 'Payment verified successfully'}, status=200)
        except razorpay.errors.SignatureVerificationError:
            payment.status = "TXN_FAILURE"
            payment.resp_code = "227"
            payment.save()
            return JsonResponse({'status': 'failure', 'message': 'Payment verification failed'}, status=400)

class ReceiptView(TemplateView):
    template_name = "receipt.html"
    def get(self, request, payment_id, *args, **kwargs):
        form_data = TblPayment.objects.get(txnid=payment_id)
        context = {
            "form_data": form_data,
            "legal_content": LegalContent.objects.all(),
            "product_name": PricingPlan.objects.get(id=form_data.product_name).name
        }
        return render(request, self.template_name, context)



class ChatView(LoginRequiredMixin, TemplateView):
    template_name = "chat.html"
    login_url = '/login/'
    redirect_field_name = 'next'

    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            current_date = now().date()
            user = request.user
            if user.status != 'Approved' or user.valid_date < current_date:
                return redirect('pricing')

        return super().dispatch(request, *args, **kwargs)

    def get_context_data(self, category, session_id, **kwargs):
        context = super().get_context_data(**kwargs)
        if category == 'incometax': cat_id = 1
        elif category == 'gst': cat_id = 2
        else: return redirect('index')
        context["legal_content"] = LegalContent.objects.all()
        context["chats_history"] = AiChatSession.objects.filter(user=self.request.user,category=cat_id).order_by('started_at')
        context['category'] = category
        context['session_id'] = session_id
        context['old_chats'] = AiChatMessage.objects.filter(session_id=session_id).order_by('created_at')
        return context

class ChatNewView(LoginRequiredMixin, TemplateView):
    login_url = '/ai/login/'
    redirect_field_name = 'next'

    def dispatch(self, request, category, *args, **kwargs):
        if request.user.is_authenticated:
            current_date = now().date()
            user = request.user
            if user.status != 'Approved' or user.valid_date < current_date:
                return redirect('pricing')
            session_id = str(uuid4())
            if category == 'incometax': cat_id = 1
            elif category == 'gst': cat_id = 2
            else: return redirect('index')
            blank_chats = AiChatSession.objects.filter(user=user, category=cat_id, title="New Chat")
            blank_chats.delete()
            chat_session = AiChatSession.objects.create(
                session_token=session_id,
                user=user,
                category=cat_id
            )
            return redirect(f'/ai/chat/{category}/{chat_session.pk}/')
            # return redirect('chat:chat_session', category=category, session_token=chat_session.pk)
        return super().dispatch(request, category, *args, **kwargs)

    def get_context_data(self, category, **kwargs):
        context = super().get_context_data(**kwargs)
        context["legal_content"] = LegalContent.objects.all()
        context['category'] = category

        return context

class ChatDeleteView(LoginRequiredMixin, TemplateView):
    login_url = '/login/'
    redirect_field_name = 'next'

    def dispatch(self, request, category, session_id, *args, **kwargs):
        if request.user.is_authenticated:
            current_date = now().date()
            user = request.user
            if user.status != 'Approved' or user.valid_date < current_date:
                return redirect('pricing')
            if category == 'incometax': cat_id = 1
            elif category == 'gst': cat_id = 2
            else: return redirect('index')
            blank_chats = AiChatSession.objects.filter(user=user, category=cat_id, id=session_id)
            blank_chats.delete()
            if AiChatSession.objects.filter(user=user, category=cat_id).exists():
                chat_session = AiChatSession.objects.filter(user=user, category=cat_id).last()
                redirect_url = f'/ai/chat/{category}/{chat_session.pk}/'
            else: redirect_url = f'/ai/chat/{category}/'
            return redirect(redirect_url)
        return super().dispatch(request, category, session_id, *args, **kwargs)

    def get_context_data(self, category, **kwargs):
        context = super().get_context_data(**kwargs)
        context["legal_content"] = LegalContent.objects.all()
        context['category'] = category

        return context


import json
import requests
import uuid

from django.http import JsonResponse, HttpResponse
from django.shortcuts import redirect
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings

from . import PaytmChecksum


@csrf_exempt
def payment(request):
    try:
        body_unicode = request.body.decode('utf-8')
        body_data = data = json.loads(body_unicode)
        orderId = body_data['orderNumber']
        userDetails = body_data['userDetails']
        product_name = get_plan_year(body_data['selectedPlans'])
        # data = TblPayment.objects.create(
        #     email_id=userDetails['email'],
        #     user_id=User.objects.get(email__iexact=userDetails['email'], is_salesman=False).pk,
        #     name=userDetails['name'],
        #     mobile_no=userDetails['mobileNumber'],
        #     company_name=userDetails['companyName'],
        #     address=userDetails['address'],
        #     legal_name=userDetails['legalName'],
        #     gstin=userDetails['gstin'],
        #     booked_by_id=data['selectedSalesman'],
        #     product_name=product_name,
        #     order_number=data['orderNumber'],
        #     amount=data['amount'],
        #     gst='18',
        #     gst_amount=data['taxAmount'],
        #     payable_amount=data['totalAmount'],
        #     txnid="",
        #     status='Pending',
        # )
        # data.save()
        paytmParams = {'body':{
            "requestType": "Payment",
            "mid" : settings.PAYTM_MID,
            "orderId" : str(orderId),
            "websiteName": settings.PAYTM_WEBSITE,
            "txnAmount" : {
                "value": str(int(round(body_data['totalAmount']))),
                "currency" : "INR",
            },
            "userInfo" : {
                "custId" : "CUST_001",
            }
        }}
        checksum = PaytmChecksum.generateSignature(json.dumps(paytmParams["body"]), settings.PAYTM_MERCHANT_KEY)
        paytmParams["head"] = {"signature" : checksum}
        post_data = json.dumps(paytmParams)
        url = f"{settings.PAYTM_PRODUCTION_URL}?mid={settings.PAYTM_MID}&orderId={orderId}"
        response = requests.post(url, data=post_data, headers={"Content-type": "application/json"})
        return JsonResponse(response.json())
    except Exception as e:
        print(e)
        return JsonResponse({"error" : str(e)}, status=400)

@csrf_exempt
def paytm_response(request):
    body_unicode = request.body.decode('utf-8')
    paytm_params = json.loads(body_unicode)
    is_valid_checksum = False
    if 'CHECKSUMHASH' in paytm_params:
        paytm_checksum = paytm_params['CHECKSUMHASH']
        is_valid_checksum = PaytmChecksum.verifySignature(
            paytm_params, settings.PAYTM_MERCHANT_KEY, paytm_checksum
        )
        return JsonResponse({
            "success": True,
            "message": "Transaction successful",
            "transaction_id": paytm_params.get("TXNID"),
        }, status=200)

    if is_valid_checksum:
        payment = TblPayment.objects.get(order_number=paytm_params.get("ORDERID"))
        payment.txnid = paytm_params.get("TXNID")
        payment.bank_txnid = paytm_params.get("BANKTXNID")
        payment.payment_mode = paytm_params.get("PAYMENTMODE")
        # payment.bank_name = paytm_params.get("bank")
        payment.gateway_name = paytm_params.get("GATEWAYNAME")
        payment.save()
        if paytm_params.get("RESPCODE") == "01":
            payment.status = paytm_params.get("RESPMSG")
            payment.resp_code = paytm_params.get("RESPCODE")
            payment.save()
            return JsonResponse({
                "success": True,
                "message": "Transaction successful",
                "transaction_id": paytm_params.get("TXNID"),
            }, status=200)
        else:
            payment.status = paytm_params.get("RESPMSG")
            payment.resp_code = paytm_params.get("RESPCODE")
            payment.save()
            return JsonResponse({
                "success": False,
                "message": "Transaction failed",
                "order_id": paytm_params.get("ORDERID"),
                "reason": paytm_params.get("RESPMSG")
            }, status=200)
    else:
        # payment.status = "TXN_FAILURE"
        # payment.resp_code = "400"
        # payment.save()
        return JsonResponse({
            "success": False,
            "message": "Invalid checksum"
        }, status=400)



@csrf_exempt
def create_order(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        order_data = {
            'amount': int(round(data['totalAmount'] * 100)),
            'currency': 'INR',
            'payment_capture': 1
        }
        order = client.order.create(data=order_data)
        userDetails = data['userDetails']
        product_name = get_plan_year(data['selectedPlans'])
        data = TblPayment.objects.create(
            email_id=userDetails['email'],
            user_id=User.objects.get(email__iexact=userDetails['email'], is_salesman=False).pk,
            name=userDetails['name'],
            mobile_no=userDetails['mobileNumber'],
            company_name=userDetails['companyName'],
            address=userDetails['address'],
            legal_name=userDetails['legalName'],
            gstin=userDetails['gstin'],
            booked_by_id=data['selectedSalesman'],
            product_name=product_name,
            order_number=data['orderNumber'],
            amount=data['amount'],
            gst='18',
            gst_amount=data['taxAmount'],
            payable_amount=data['totalAmount'],
            txnid=order['id'],
            status='Pending',
        )
        data.save()
        return JsonResponse(order)

@csrf_exempt
def create_order2(request):
    if request.method == 'POST':
        RAZORPAY_KEY_ID = 'rzp_test_pOCIYbOYzrYWUK'
        RAZORPAY_KEY_SECRET = 'naQ0AQuSB0BimggKWZaeaymq'
        client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
        data = json.loads(request.body.decode('utf-8'))
        order_data = {
            'amount': 499 * 100,
            'currency': 'INR',
            'payment_capture': 1
        }
        order = client.order.create(data=order_data)
        print(order)
        return JsonResponse(order)


@csrf_exempt
@require_POST
def verify_payment2(request):
    payment_data = json.loads(request.body.decode('utf-8'))
    razorpay_order_id = payment_data.get('razorpay_order_id')
    razorpay_payment_id = payment_data.get('razorpay_payment_id')
    razorpay_signature = payment_data.get('razorpay_signature')
    params = {
        'razorpay_order_id': razorpay_order_id,
        'razorpay_payment_id': razorpay_payment_id,
        'razorpay_signature': razorpay_signature,
    }

    payment_details = client.payment.fetch(razorpay_payment_id)
    try:
        client.utility.verify_payment_signature(params)
        print({'status': 'success', 'message': 'Payment verified successfully'})
        return JsonResponse({'status': 'success', 'message': 'Payment verified successfully'})
    except razorpay.errors.SignatureVerificationError:
        print({'status': 'failure', 'message': 'Payment verification failed'})
        return JsonResponse({'status': 'failure', 'message': 'Payment verification failed'}, status=400)

@csrf_exempt
@require_POST
def verify_payment(request):
    payment_data = json.loads(request.body.decode('utf-8'))
    razorpay_order_id = payment_data.get('razorpay_order_id')
    razorpay_payment_id = payment_data.get('razorpay_payment_id')
    razorpay_signature = payment_data.get('razorpay_signature')
    payment = TblPayment.objects.get(txnid=razorpay_order_id)
    params = {
        'razorpay_order_id': razorpay_order_id,
        'razorpay_payment_id': razorpay_payment_id,
        'razorpay_signature': razorpay_signature,
    }

    payment_details = client.payment.fetch(razorpay_payment_id)
    payment.txnid = payment_details.get("order_id")
    payment.bank_txnid = payment_details.get("id")
    payment.payment_mode = payment_details.get("method")
    payment.bank_name = payment_details.get("bank")
    payment.gateway_name = payment_details.get("bank")
    payment.save()
    try:
        client.utility.verify_payment_signature(params)
        payment.status = "TXN_SUCCESS"
        payment.resp_code = "01"
        payment.save()
        return JsonResponse({'status': 'success', 'message': 'Payment verified successfully'})
    except razorpay.errors.SignatureVerificationError:
        payment.status = "TXN_FAILURE"
        payment.resp_code = "227"
        payment.save()
        return JsonResponse({'status': 'failure', 'message': 'Payment verification failed'}, status=400)

def block_admin_login(request):
    return HttpResponseForbidden("Access Denied")

from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import *

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


from django.db.models import Prefetch
from rest_framework.views import APIView
from rest_framework.response import Response

from .serializers import (
    BannerSerializer,
    CounterBoardSerializer,
    ServiceSerializer,
    FAQSerializer,
    PricingPlanSerializer,
    RoadmapStepSerializer,
    LegalContentSerializer,
)


class LandingAPIView(APIView):
    permission_classes = []

    def get(self, request):
        pricing_plans = PricingPlan.objects.prefetch_related(
            Prefetch(
                "features",
                queryset=PricingFeature.objects.only("id", "feature_text", "plan"),
            )
        )

        data = {
            "banner": BannerSerializer(Banner.objects.first()).data,
            "roadmap_steps": RoadmapStepSerializer(
                RoadmapStep.objects.all(),
                many=True
            ).data,
            "counters": CounterBoardSerializer(
                CounterBoard.objects.all(),
                many=True
            ).data,
            "services": ServiceSerializer(
                Service.objects.filter(is_active=True),
                many=True
            ).data,
            "faqs": FAQSerializer(
                FAQ.objects.all(),
                many=True
            ).data,
            "pricing_plans": PricingPlanSerializer(
                pricing_plans,
                many=True
            ).data,
            "legal_content": LegalContentSerializer(
                LegalContent.objects.all(),
                many=True
            ).data,
        }

        return Response(data)

from rest_framework import status

class ContactMessageCreateAPIView(APIView):
    def post(self, request):
        serializer = ContactMessageSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Message sent successfully"},
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from rest_framework import generics
from rest_framework.generics import CreateAPIView

class SalesmanListView(APIView):
    def get(self, request, *args, **kwargs):
        salesmen = User.objects.filter(is_salesman=True, is_active=True).order_by('name')
        serializer = SalesmanSerializer(salesmen, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class PlansListView(generics.ListAPIView):
    # permission_classes = [IsLoginAuthenticated]
    serializer_class = PlansListSerializer
    model = PricingPlan
    queryset = PricingPlan.objects
    # lookup_field = 'pk'


class UserRegisterView(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = CustomUserCreateSerializer

class UserDetailsView(APIView):

    def get(self, request, email):
        try:
            user = User.objects.get(email__iexact=email, is_salesman=False)
            user_data = {
                'id': user.pk,
                'email': user.username,
                'name': user.name,
                'mobileNumber': user.mobileno,
                'companyName': user.company,
                'address': user.address,
                'legalName': '',
                'gstin': '',
                'isFounderMember' : True if user.founder_member == 'Founder Member' else False,
            }
            payment = TblPayment.objects.filter(user=user)
            if payment.exists():
                user_data['legal_name'] = payment.first().legal_name
                user_data['gstin'] = payment.first().gstin

            return Response(user_data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User with this email does not exist."}, status=status.HTTP_404_NOT_FOUND)


from django.http import HttpResponseForbidden
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .utils import send_forgot_password_email

def block_admin_login(request):
    return HttpResponseForbidden("Access Denied")


@method_decorator(csrf_exempt, name='dispatch')
class ForgetPasswordViews(View):

    def post(self, request, *args, **kwargs):
        body_unicode = request.body.decode('utf-8')
        body_data = json.loads(body_unicode)
        email = body_data.get('email')

        if not email:
            return JsonResponse({'error': 'Email is required'}, status=400)

        try:
            user = User.objects.get(email=email)
            send_forgot_password_email(user)
            return JsonResponse({'message': '✅ Password sent to your email successfully!'}, status=200)
        except User.DoesNotExist:
            return JsonResponse({'error': '❌ User not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': f'❌ Something went wrong: {str(e)}'}, status=500)

class LegalContentDetailView(APIView):
    def get(self, request, slug):
        content = get_object_or_404(LegalContent, slug=slug)
        serializer = LegalContentSerializer(content)
        return Response(serializer.data)

from rest_framework.permissions import BasePermission

class IsLoginAuthenticated(BasePermission):

    def has_permission(self, request, view):
        try:
            if request.user and request.user.is_authenticated:
                return True
            return False
        except Exception as e:
            return False

class BasicSettingView(APIView):
    permission_classes = [IsLoginAuthenticated]

    def get(self, request):
        profile = request.user
        serializer = BasicSettingSerializer(profile)
        return Response(serializer.data)

    def put(self, request):
        profile = request.user
        serializer = BasicSettingSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ChangePasswordView(APIView):
    permission_classes = [IsLoginAuthenticated]

    def put(self, request):
        user = request.user
        data = request.data

        current_password = data.get("current_password")
        new_password = data.get("new_password")
        confirm_password = data.get("confirm_password")

        if not user.check_password(current_password):
            return Response({"detail": "Current password is incorrect."}, status=status.HTTP_400_BAD_REQUEST)

        if new_password != confirm_password:
            return Response({"detail": "Passwords do not match."}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.passwordd = new_password
        user.save()
        return Response({"detail": "Password updated successfully."})
