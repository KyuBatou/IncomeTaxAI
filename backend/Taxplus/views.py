from datetime import datetime
import json
from uuid import uuid4
from django.contrib.auth.mixins import LoginRequiredMixin
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

class IndexView(FormView, TemplateView):
    template_name = "index.html"
    form_class = ContactMessageForm
    success_url = reverse_lazy('index')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["roadmap_steps"] = RoadmapStep.objects.all()
        context["counters"] = CounterBoard.objects.all()
        context["services"] = Service.objects.filter(is_active=True)
        context["faqs"] = FAQ.objects.all()
        context["pricing_plans"] = PricingPlan.objects.prefetch_related(
            Prefetch('features', queryset=PricingFeature.objects.only('feature_text'))
        )
        context["banner"] = Banner.objects.first()
        context["legal_content"] = LegalContent.objects.all()
        return context

    def form_valid(self, form):
        form.save()
        messages.success(self.request, "Your message has been sent successfully!")
        return super().form_valid(form)

    def form_invalid(self, form):
        return super().form_invalid(form)

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
        body_data = json.loads(request.body.decode('utf-8'))
        print("body_data", body_data)

        order_id = body_data['orderId']
        # print(body_data['email'])
        # print(body_data['name'])
        # print(body_data['mobileNumber'])
        # print(body_data['companyName'])
        # print(body_data['address'])
        # print(body_data['legalName'])
        # print(body_data['gstin'])
        # print(body_data['selectedSalesman'])
        print(body_data['product_name'])
        # print(body_data['amount'])
        # print(body_data['taxAmount'])
        # print(body_data['totalAmount'])

        # product_name = get_plan_year(body_data['selectedPlans'])
        data = TblPayment.objects.create(
            email_id=body_data['email'],
            user_id=User.objects.get(email__iexact=body_data['email'], is_salesman=False).pk,
            name=body_data['name'],
            mobile_no=body_data['mobileNumber'],
            company_name=body_data['companyName'],
            address=body_data['address'],
            legal_name=body_data['legalName'],
            gstin=body_data['gstin'],
            # booked_by_id=data['selectedSalesman'],
            # product_name=body_data['product_name'],
            order_number=body_data['orderId'],
            amount=body_data['amount'],
            gst='18',
            gst_amount=body_data['taxAmount'],
            payable_amount=body_data['totalAmount'],
            txnid="",
            status='Pending',
        )
        data.save()
        paytmParams = {
            "body": {
                "requestType": "Payment",
                "mid": settings.PAYTM_MID,
                "websiteName": settings.PAYTM_WEBSITE,
                "orderId": str(order_id),
                "callbackUrl": "https://ai.incometaxlibrary.com/ai/verify-paytm-payment/",
                "txnAmount" : {
                    "value": str(body_data['totalAmount']),
                    "currency" : "INR",
                },
                "userInfo" : {
                    "custId" : "CUST_001",
                }
            }
        }

        checksum = PaytmChecksum.generateSignature(json.dumps(paytmParams["body"]), settings.PAYTM_MERCHANT_KEY)
        paytmParams["head"] = {"signature" : checksum}
        post_data = json.dumps(paytmParams)
        url = f"{settings.PAYTM_PRODUCTION_URL}?mid={settings.PAYTM_MID}&orderId={order_id}"
        response = requests.post(url, data=post_data, headers={"Content-type": "application/json"})
        print(response.json())
        return JsonResponse(response.json())

    except Exception as e:
        print(e)
        return JsonResponse({"error": str(e)}, status=400)


@csrf_exempt
def paytm_response(request):
    print("request.POST", type(request.POST))
    # paytm_params = dict(request.POST)
    paytm_params = request.POST.dict()

    paytm_checksum = paytm_params.get('CHECKSUMHASH')

    is_valid = PaytmChecksum.verifySignature(
        paytm_params,
        settings.PAYTM_MERCHANT_KEY,
        paytm_checksum
    )

    if is_valid:
        order_id = paytm_params.get("ORDERID")
        payment = TblPayment.objects.get(order_number=order_id)

        payment.txnid = paytm_params.get("TXNID")
        payment.bank_txnid = paytm_params.get("BANKTXNID")
        payment.payment_mode = paytm_params.get("PAYMENTMODE")
        payment.gateway_name = paytm_params.get("GATEWAYNAME")

        if paytm_params.get("RESPCODE") == "01":
            payment.status = "SUCCESS"
        else:
            payment.status = "FAILED"

        payment.save()

        return redirect(f"/ai/receipt/{payment.txnid}/")

    return HttpResponse("Checksum mismatch", status=400)


def block_admin_login(request):
    return HttpResponseForbidden("Access Denied")

from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import *

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
