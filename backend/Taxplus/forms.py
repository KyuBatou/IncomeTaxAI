from core.models import ContactMessage
from login_auth.models import User
from django import forms


class ContactMessageForm(forms.ModelForm):
    name = forms.CharField(max_length=150, required=True, widget=forms.TextInput(attrs={'placeholder': 'Your Name', 'class': 'form-control'}))
    email = forms.EmailField(required=True, widget=forms.EmailInput(attrs={'placeholder': 'Your Email', 'class': 'form-control'}))
    phone = forms.CharField(max_length=50, required=True, widget=forms.TextInput(attrs={'placeholder': 'Phone', 'class': 'form-control'}))
    subject = forms.CharField(max_length=150, required=True, widget=forms.TextInput(attrs={'placeholder': 'Subject', 'class': 'form-control'}))
    message = forms.CharField(widget=forms.Textarea(attrs={'placeholder': 'Please describe what you need', 'class': 'form-control', 'rows': 4}), required=True)

    class Meta:
        model = ContactMessage
        fields = ['name', 'email', 'phone', 'subject', 'message']


class EmailCheckForm(forms.Form):
    email = forms.EmailField(
        widget=forms.EmailInput(attrs={
            "class": "form-control",
            "placeholder": "Enter Email"
        })
    )


class UserDetailsForm(forms.ModelForm):

    email = forms.EmailField(label='Your Email', widget=forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'Enter your email'}))

    legal_name = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={"class": "form-control"})
    )

    gstin = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={"class": "form-control"})
    )

    class Meta:
        model = User
        fields = [
            "email",
            "name",
            "mobileno",
            "company",
            "address",
        ]

        widgets = {
            "email": forms.TextInput(attrs={"class": "form-control"}),
            "name": forms.TextInput(attrs={"class": "form-control"}),
            "mobileno": forms.TextInput(attrs={"class": "form-control"}),
            "company": forms.TextInput(attrs={"class": "form-control"}),
            "address": forms.Textarea(attrs={"class": "form-control", "rows": 2}),
        }