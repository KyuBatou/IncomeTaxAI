from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from django.utils.timezone import now

def send_registration_email(user, ):
    context = {
        'email': user.email,
        'password': user.passwordd,
        'name': user.name,
        'address': user.address,
        'city': user.city,
        'pin': user.pin,
        'mobileno': user.mobileno,
        'date': now().strftime('%d-%m-%Y %H:%M:%S')
    }

    subject = "Registration Confirmation Mail From Income Tax Library"
    from_email = settings.EMAIL_HOST_USER
    to_email = [user.email]

    try:
        text_content = render_to_string('email/registration.txt', context)
        html_content = render_to_string('email/registration.html', context)

        msg = EmailMultiAlternatives(subject, text_content, from_email, to_email)
        msg.attach_alternative(html_content, "text/html")
        msg.send()
        return True
    except Exception as e:
        print(f"Failed to send registration email: {e}")
        return False


def send_forgot_password_email(user):
    subject = 'Password Recovery - Income Tax Library'
    from_email = settings.EMAIL_HOST_USER
    context = {
        'name': user.name,
        'username': user.email,
        'password': user.passwordd,
        'email': user.email,
        'year': now().strftime('%Y'),
        'date_time': now().strftime('%d-%m-%Y %H:%M:%S'),
    }

    text_content = render_to_string('email/forgot_password.txt', context)
    html_content = render_to_string('email/forgot_password.html', context)

    text_content = strip_tags(html_content)

    email = EmailMultiAlternatives(subject, text_content, from_email, [user.email])
    email.attach_alternative(html_content, "text/html")
    email.send()
