from rest_framework import serializers
from .models import *


class AiChatSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AiChatSession
        fields = "__all__"
        read_only_fields = ("user",)


class AiChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = AiChatMessage
        fields = "__all__"
        read_only_fields = ["created_at"]

