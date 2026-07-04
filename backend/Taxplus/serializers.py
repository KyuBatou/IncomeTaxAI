from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed
from login_auth.models import * 
from datetime import datetime
from rest_framework import serializers
from core.models import * 

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        if self.user.is_salesman:
            raise AuthenticationFailed("Invalid credentials for user login.")
        request = self.context.get("request")
        access_token = data.get('access')
        if self.user.is_multi_user == 'False': AuthSession.invalidate_previous_tokens(self.user)
        AuthSession.create_login_record(
            user=self.user,
            token_jti=access_token,
            request=request
        )
        return data

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['user_id'] = user.id
        token['username'] = user.username
        token['email'] = user.username
        token['name'] = user.name
        token['telephone'] = user.telephone
        token['mobile'] = user.mobileno
        token['is_salesman'] = user.is_salesman
        token['is_active'] = user.is_active
        token['is_approved'] = (user.status == 'Approved' and user.valid_date and user.valid_date >= datetime.now().date())
        token['is_staff'] = user.is_staff
        token['monthly_page_view'] = user.monthly_page_view
        token['user_monthly_page_view'] = user.user_monthly_page_view
        token['is_future'] = user.is_future
        token['is_ai_web'] = user.is_ai_web
        token['monthly_ai_page_view'] = user.monthly_ai_page_view
        token['ai_monthly_page_view'] = user.ai_monthly_page_view

        return token

class BannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Banner
        fields = "__all__"

class CounterBoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = CounterBoard
        fields = "__all__"

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = "__all__"

class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = "__all__"

class RoadmapStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoadmapStep
        fields = "__all__"

class LegalContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = LegalContent
        fields = ["id", "section", "slug",]

class PricingFeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = PricingFeature
        fields = ["id", "feature_text"]

class PricingPlanSerializer(serializers.ModelSerializer):
    features = PricingFeatureSerializer(many=True, read_only=True)

    class Meta:
        model = PricingPlan
        fields = "__all__"

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = "__all__"

