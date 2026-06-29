from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import *


router = DefaultRouter()
router.register(r'sessions', AiChatSessionViewSet, basename='session')

urlpatterns = [
    path('chat/gpt/', SummarizeView.as_view(), name='chat_gpt'),
    path('chat/clarify/', ClarifyView.as_view(), name='chat_clarify'),
    path('chat/refine/', RefineView.as_view(), name='chat_refine'),
    path('chat/similar/', SimilarView.as_view(), name='chat_similar'),
    path("sessions/<int:session_id>/messages/", SessionMessagesView.as_view()),
    path('api/', include(router.urls)),
]
