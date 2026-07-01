from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import *

from .case_law_research_views import *

router = DefaultRouter()
router.register(r'sessions', AiChatSessionViewSet, basename='session')

urlpatterns = [
    path('chat/gpt/', SummarizeView.as_view(), name='chat_gpt'),
    path('chat/clarify/', ClarifyView.as_view(), name='chat_clarify'),
    path('chat/refine/', RefineView.as_view(), name='chat_refine'),
    path('chat/similar/', SimilarView.as_view(), name='chat_similar'),
    path("sessions/<int:session_id>/messages/", SessionMessagesView.as_view()),
    path('api/', include(router.urls)),

    path('chat/case-law-research/gpt/', CaseLawSummarizeView.as_view(), name='chat_gpt'),
    path('chat/case-law-research/clarify/', CaseLawClarifyView.as_view(), name='chat_clarify'),
    path('chat/case-law-research/refine/', CaseLawRefineView.as_view(), name='chat_refine'),
    path('chat/case-law-research/similar/', CaseLawSimilarView.as_view(), name='chat_similar'),

]
