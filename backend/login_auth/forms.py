from django.core.exceptions import ValidationError
from login_auth.models import User

from django import forms
import re

class LoginForm(forms.Form):
    # email = forms.EmailField(label='Your Email', widget=forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'Enter your email'}))
    email = forms.EmailField(
        label='Username/Your Email', 
        widget=forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'Enter your email'})
    )

    password = forms.CharField(label='Password', widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'Enter your password'}))
    remember_me = forms.BooleanField(required=False, initial=False, label='Remember for 30 days', widget=forms.CheckboxInput(attrs={'class': 'form-check-input'}))



class SignupForm(forms.Form):
    email = forms.EmailField(
        label='Username/Your Email', 
        widget=forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'Enter your email'})
    )
    name = forms.CharField(
        max_length=100, 
        required=True, 
        label='Full Name', 
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter your full name'})
    )
    password = forms.CharField(
        label='Password', 
        widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'Enter your password'})
    )
    confirm_password = forms.CharField(
        label='Confirm Password', 
        widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'Confirm your password'})
    )
    mobile = forms.CharField(
        max_length=15, 
        required=True, 
        label='Mobile Number', 
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter your mobile number'})
    )
    company = forms.CharField(
        max_length=100, 
        required=True, 
        label='Company', 
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter your company name'})
    )
    address = forms.CharField(
        max_length=255, 
        required=True, 
        label='Address', 
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter your address'})
    )
    city = forms.CharField(
        max_length=100, 
        required=True, 
        label='City', 
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter your city'})
    )
    state = forms.CharField(
        max_length=100, 
        required=True, 
        label='State', 
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter your state'})
    )
    pincode = forms.CharField(
        max_length=10, 
        required=True, 
        label='Pincode', 
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter your pincode'})
    )
    telephone = forms.CharField(
        max_length=15, 
        label='Telephone (Optional)', 
        required=False, 
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter your telephone number (optional)'})
    )
    fax = forms.CharField(
        max_length=15, 
        label='Fax (Optional)', 
        required=False, 
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter your fax number (optional)'})
    )


    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get("password")
        confirm_password = cleaned_data.get("confirm_password")
        email = cleaned_data.get("email")
        mobile = cleaned_data.get("mobile")

        # Check if passwords match
        if password and confirm_password:
            if password != confirm_password:
                raise ValidationError("The passwords do not match.")

        # Validate email uniqueness
        if User.objects.filter(email=email).exists():
            raise ValidationError("This email is already in use.")

        # Validate password strength (optional, but recommended)
        if password:
            if len(password) < 8:
                raise ValidationError("Password must be at least 8 characters long.")
            if not re.search(r'[A-Z]', password):
                raise ValidationError("Password must contain at least one uppercase letter.")
            if not re.search(r'[a-z]', password):
                raise ValidationError("Password must contain at least one lowercase letter.")
            if not re.search(r'[0-9]', password):
                raise ValidationError("Password must contain at least one digit.")
            if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
                raise ValidationError("Password must contain at least one special character.")

        return cleaned_data


class ForgotPasswordForm(forms.Form):
    email = forms.EmailField(
        label='Username/Your Email', 
        widget=forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'Enter your email'})
    )


class BasicInfoForm(forms.Form):
    email = forms.EmailField(
        label='Username/Your Email', 
        widget=forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'Enter your email', 'readonly': 'readonly'})
    )
    
    name = forms.CharField(
        max_length=100, 
        required=True, 
        label='Full Name', 
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter your full name', 'readonly': 'readonly'})
    )

    mobile = forms.CharField(
        max_length=15, 
        required=True, 
        label='Mobile Number', 
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter your mobile number'})
    )
    company = forms.CharField(
        max_length=100, 
        required=False, 
        label='Company', 
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter your company name'})
    )
    address = forms.CharField(
        max_length=255, 
        required=True, 
        label='Address', 
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter your address'})
    )
    city = forms.CharField(
        max_length=100, 
        required=True, 
        label='City', 
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter your city'})
    )
    state = forms.CharField(
        max_length=100, 
        required=True, 
        label='State', 
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter your state'})
    )
    pincode = forms.CharField(
        max_length=10, 
        required=True, 
        label='Pincode', 
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter your pincode'})
    )
    telephone = forms.CharField(
        max_length=15, 
        label='Telephone (Optional)', 
        required=False, 
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter your telephone number (optional)'})
    )
    fax = forms.CharField(
        max_length=15, 
        label='Fax (Optional)', 
        required=False, 
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter your fax number (optional)'})
    )

    regdate = forms.CharField(
        max_length=100, 
        label='Expiry Date', 
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Expiry Date', 'readonly': 'readonly'})
    )
    valid_date = forms.CharField(
        max_length=100, 
        label='Valid Date', 
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Valid Date', 'readonly': 'readonly'})
    )
    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user', None)  # Get the user from kwargs and remove it from kwargs

        super().__init__(*args, **kwargs)  # Call the parent class's __init__ method

        if user:
            # Fill the form with the user's data (if user is provided)
            self.fields['email'].initial = user.email
            self.fields['name'].initial = user.name
            self.fields['mobile'].initial = user.mobileno
            self.fields['company'].initial = user.company
            self.fields['address'].initial = user.address
            self.fields['city'].initial = user.city
            self.fields['state'].initial = user.state
            self.fields['pincode'].initial = user.pin
            self.fields['telephone'].initial = user.telephone
            self.fields['fax'].initial = user.fax
            self.fields['regdate'].initial = user.regdate
            self.fields['valid_date'].initial = user.valid_date


class ResetPasswordForm(forms.Form):
    old_password = forms.CharField(
        label='Old Password',
        widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'Enter your old password'}),
        required=True
    )
    new_password = forms.CharField(
        label='New Password',
        widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'Enter your new password'}),
        required=True,
    )
    confirm_new_password = forms.CharField(
        label='Confirm New Password',
        widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'Confirm your new password'}),
        required=True
    )
