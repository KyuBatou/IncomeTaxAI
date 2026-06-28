# from django.conf.urls.static import static
# from django.urls import path, include
# from django.contrib import admin
# from django.conf import settings
# from .views import *

# urlpatterns = [
#     path('', include("core.urls")),
#     path('', include("login_auth.urls")),

#     path('jet/', include('jet.urls', 'jet')),
#     path('jaishreekrishnahanuman/login/', admin.site.login, name='admin:login'),
#     path('salesman/', admin.site.login, name='admin:login'),
#     path('admin/login/', block_admin_login),
#     path('admin/', admin.site.urls),

#     # path('auth/', include('djoser.urls')),
#     # path('auth/jwt/create/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
#     # path('auth/user/<str:email>/', UserDetailsView.as_view(), name='user-details-by-email'),
#     # path('auth/forget-password/', ForgetPasswordView.as_view(), name='forget-password-email'),
#     # path("auth/user/", UserRegisterView.as_view(), name='user-register'),
#     # path('auth/', include('djoser.urls.jwt')),
#     # path('auth/basic/setting/', BasicSettingView.as_view(), name='basic-setting-api'),
#     # path('auth/change-password/', ChangePasswordView.as_view(), name='change-password'),

#     path('', IndexView.as_view(), name='index'),
#     path('faqs/', FaqView.as_view(), name='faqs'),
#     path('about/', AboutView.as_view(), name='about'),
#     path('pricing/', PricingView.as_view(), name='pricing'),
#     path('contact/', ContactView.as_view(), name='contact'),
#     path('legal/<slug:slug>/', LegalDetailView.as_view(), name='legal_detail'),


#     path('subscribe/', SubscribeView.as_view(), name='subscribe'),
#     path('plan/', PlanView.as_view(), name='plan'),
#     path('review/', ReviewView.as_view(), name='review'),
#     path('verify/', VerifyView.as_view(), name='verify'),

#     path("receipt/<str:payment_id>/", ReceiptView.as_view(), name="receipt"),

#     path('chat/<str:category>/<int:session_id>/', ChatView.as_view(), name='chat'),
#     path('chat/<str:category>/', ChatNewView.as_view(), name='new_chat'),
#     path('chat/<str:category>/<int:session_id>/delete/', ChatDeleteView.as_view(), name='delete_chat'),

#     # path('chat/delete/<int:chat_id>/', ChatView.as_view(), name='delete_chat'),

#     # path('api/create-paytm-order/', payment, name='create_paytm_order'),
#     # path('api/verify-paytm-payment/', paytm_response, name='verify_paytm_payment'),
#     # path('api/create-order/', create_order, name='create_order'),
#     # path('api/create-order2/', create_order2, name='create_order'),
#     # path('api/verify-payment/', verify_payment, name='verify_payment'),
#     # path('api/verify-payment2/', verify_payment2, name='verify_payment'),

# ]

# # if settings.DEBUG:
# urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
# urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)



from django.conf.urls.static import static
from django.urls import path, include
from django.contrib import admin
from django.conf import settings
from .views import *

ai_patterns = [
    path('', include("core.urls")),
    # path('', include("login_auth.urls")),

    path('auth/jwt/create/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),

    path('jet/', include('jet.urls', 'jet')),
    path('jaishreekrishnahanuman/login/', admin.site.login, name='admin:login'),
    path('salesman/', admin.site.login, name='admin:login'),
    path('admin/login/', block_admin_login),
    path('admin/', admin.site.urls),

    # path('', IndexView.as_view(), name='index'),
    # path('faqs/', FaqView.as_view(), name='faqs'),
    # path('about/', AboutView.as_view(), name='about'),
    # path('pricing/', PricingView.as_view(), name='pricing'),
    # path('contact/', ContactView.as_view(), name='contact'),
    # path('legal/<slug:slug>/', LegalDetailView.as_view(), name='legal_detail'),

    # path('subscribe/', SubscribeView.as_view(), name='subscribe'),
    # path('plan/', PlanView.as_view(), name='plan'),
    # path('review/', ReviewView.as_view(), name='review'),
    # path('verify/', VerifyView.as_view(), name='verify'),

    # path("receipt/<str:payment_id>/", ReceiptView.as_view(), name="receipt"),

    # path('chat/<str:category>/<int:session_id>/', ChatView.as_view(), name='chat'),
    # path('chat/<str:category>/', ChatNewView.as_view(), name='new_chat'),
    # path('chat/<str:category>/<int:session_id>/delete/', ChatDeleteView.as_view(), name='delete_chat'),

    # path('create-paytm-order/', payment, name='create_paytm_order'),
    # path('verify-paytm-payment/', paytm_response, name='verify_paytm_payment'),
]

if settings.DEBUG:
    ai_patterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    ai_patterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns = [
    path('ai/', include(ai_patterns)),
    path('', IndexView.as_view(), name='index'),

]