from django.contrib.auth import views as auth_views
from django.urls import path
from .views import *

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('signup/', SignupView.as_view(), name='signup'),
    path('logout/', auth_views.LogoutView.as_view(next_page='login'), name='logout'),
    path('forget-password/', ForgetPasswordView.as_view(), name='forget-password-email'),
    path('settings/', SettingsView.as_view(), name='settings'),

]
