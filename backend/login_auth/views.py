from login_auth.utils import send_forgot_password_email, send_registration_email
from .forms import BasicInfoForm, ForgotPasswordForm, LoginForm, ResetPasswordForm, SignupForm
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth import authenticate, login
from django.views.generic import TemplateView
from django.views.generic import FormView
from django.shortcuts import redirect
from core.models import LegalContent
from django.contrib import messages
from login_auth.models import User


class LoginView(TemplateView):
    template_name = "login.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['form'] = LoginForm()
        context["legal_content"] = LegalContent.objects.all()
        return context

    def post(self, request, *args, **kwargs):
        form = LoginForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']
            remember_me = form.cleaned_data['remember_me']
            user = authenticate(request, username=email, password=password)

            if user is not None:
                login(request, user)
                if remember_me: request.session.set_expiry(30 * 24 * 60 * 60)
                next_url = request.GET.get('next')
                if not next_url: next_url = 'index'
                # return redirect(next_url)
                return redirect("new_chat", category="gst")
            else:
                form.add_error('email', "Invalid email or password")

        return self.render_to_response({'form': form, 'legal_content': LegalContent.objects.all()})

    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            next_url = request.GET.get('next', 'index')
            return redirect(next_url)
        return super().dispatch(request, *args, **kwargs)


class SignupView(FormView):
    form_class = SignupForm
    template_name = 'signup.html'

    def form_valid(self, form):
        try:
            # Extract form data
            password = form.cleaned_data['password']
            user = User(
                email=form.cleaned_data['email'],
                name=form.cleaned_data['name'],
                mobileno=form.cleaned_data['mobile'],
                company=form.cleaned_data['company'],
                address=form.cleaned_data['address'],
                city=form.cleaned_data['city'],
                state=form.cleaned_data['state'],
                pin=form.cleaned_data['pincode'],
                telephone=form.cleaned_data['telephone'],
                fax=form.cleaned_data['fax'],
            )
            user.passwordd = password
            user.set_password(password)
            user.save()
            send_registration_email(user)

            # Add success message
            messages.success(self.request, f"User created successfully, {user.email}!")

            # Render the same page with an empty form
            return self.render_to_response(self.get_context_data(form=self.form_class()))

        except Exception as e:
            print(e)
            messages.error(self.request, f"Error creating user: {e}")
            return self.form_invalid(form)

    def form_invalid(self, form):
        # Form has errors, render with errors and messages
        return self.render_to_response(self.get_context_data(form=form))

from django.shortcuts import render, redirect

class ForgetPasswordView(TemplateView):
    template_name = "forget_password.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['form'] = ForgotPasswordForm()
        context["legal_content"] = LegalContent.objects.all()
        return context

    def post(self, request, *args, **kwargs):
        form = ForgotPasswordForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data['email']
            try:
                user = User.objects.get(email=email)
                send_forgot_password_email(user)
                return render(request, 'forget_password.html', {
                    'form': form, 'message': '✅ Password reset instructions sent to your email.',
                    'legal_content': LegalContent.objects.all()
                })
            except User.DoesNotExist:
                error_message = '❌ No user found with this email address.'
            except Exception as e:
                error_message = f'❌ Something went wrong: {str(e)}'
            return render(request, 'forget_password.html', {
                'form': form, 'error': error_message, 'legal_content': LegalContent.objects.all()
            })
        return render(request, 'forget_password.html', {'form': form, 'legal_content': LegalContent.objects.all()})



class SettingsView(LoginRequiredMixin, TemplateView):
    template_name = "settings.html"
    login_url = '/login/'
    redirect_field_name = 'next'


    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['basic_info_form'] = BasicInfoForm(user=self.request.user)
        context['reset_password_form'] = ResetPasswordForm()        
        context["legal_content"] = LegalContent.objects.all()
        context['active_tab'] = self.request.GET.get('active_tab', 'basic-info')
        return context


    def post(self, request, *args, **kwargs):
        basic_info_form = BasicInfoForm(request.POST, user=request.user)
        reset_password_form = ResetPasswordForm(request.POST)

        active_tab = 'basic-info'
        if 'basic_info_form' in request.POST and basic_info_form.is_valid():
            try:
                user = request.user
                user.mobileno = basic_info_form.cleaned_data['mobile']
                user.company = basic_info_form.cleaned_data['company']
                user.address = basic_info_form.cleaned_data['address']
                user.city = basic_info_form.cleaned_data['city']
                user.state = basic_info_form.cleaned_data['state']
                user.pin = basic_info_form.cleaned_data['pincode']
                user.telephone = basic_info_form.cleaned_data['telephone']
                user.fax = basic_info_form.cleaned_data['fax']
                user.save()

                messages.success(request, "Basic info updated successfully.")
            except Exception as e:
                messages.error(request, f"Error updating basic info: {str(e)}")


        elif 'reset_password_form' in request.POST and reset_password_form.is_valid():
            old_password = reset_password_form.cleaned_data['old_password']
            new_password = reset_password_form.cleaned_data['new_password']
            confirm_new_password = reset_password_form.cleaned_data['confirm_new_password']
            user = request.user
            active_tab = 'password'

            if new_password != confirm_new_password:
                messages.error(request, "The new passwords do not match. Please try again.")
            elif user.check_password(old_password):
                user.passwordd = new_password
                user.set_password(new_password)
                user.save()
                messages.success(request, "Your password has been successfully updated.")
            else:
                messages.error(request, "The old password is incorrect. Please try again.")
        return redirect(f'{self.request.path}?active_tab={active_tab}')

        # return render(request, self.template_name, {
        #     'basic_info_form': basic_info_form,
        #     'reset_password_form': reset_password_form,
        #     'legal_content': LegalContent.objects.all(),
        #     'active_tab': active_tab,
        # })