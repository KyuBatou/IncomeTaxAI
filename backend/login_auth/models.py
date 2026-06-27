from django.db import models

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone
from django.conf import settings
from django.db import models


STATUS = [
    ('Approved', 'Approved'),
    ('Pending Approval', 'Pending Approval')
]

FOUNDER = [
    ('NO', 'NO'),
    ('Founder Member', 'Founder Member')
]

MULTI_USER = [
    ('False', 'Single User'),
    ('True', 'Multi User')
]

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        extra_fields.setdefault('passwordd', password)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_salesman', True)
        extra_fields.setdefault('passwordd', password)

        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=255, blank=True, null=True)
    email = models.CharField(max_length=255, blank=True, null=True, unique=True)
    passwordd = models.CharField(max_length=100, blank=True, null=True)
    name = models.CharField(max_length=100, blank=True, null=True)
    company = models.CharField(max_length=150, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    pin = models.CharField(max_length=10, blank=True, null=True)
    telephone = models.CharField(max_length=255, blank=True, null=True)
    mobileno = models.CharField(max_length=255, blank=True, null=True)
    fax = models.CharField(max_length=25, blank=True, null=True)

    status = models.CharField(max_length=50, choices=STATUS, default='Pending Approval', blank=True, null=True)
    regdate = models.DateField(auto_now_add=True, blank=True, null=True)
    valid_date = models.DateField(blank=True, null=True)

    is_login = models.CharField(max_length=255, blank=True, null=True)
    user_session = models.CharField(max_length=255, blank=True, null=True)
    is_multi_user = models.CharField(max_length=50, choices=MULTI_USER, blank=True, null=True)
    founder_member = models.CharField(max_length=50, choices=FOUNDER, default='NO', blank=True, null=True)
    founder_member_amount = models.CharField(max_length=255, blank=True, null=True)

    tsr_name = models.CharField(max_length=255, blank=True, null=True)
    salesman = models.ForeignKey('self', on_delete=models.SET_NULL, blank=True, null=True, related_name='assigned_salesmen')

    monthly_page_view = models.IntegerField(default='100', blank=True, null=True)
    user_monthly_page_view = models.IntegerField(default='0', blank=True, null=True)
    user_page_view_month = models.IntegerField(default='0', blank=True, null=True)

    is_salesman = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_future = models.BooleanField(default=False)
    is_ai_web = models.BooleanField(default=False)
    monthly_ai_page_view = models.IntegerField(default='100', blank=True, null=True)
    ai_monthly_page_view = models.IntegerField(default='0', blank=True, null=True)
    ai_page_view_month = models.IntegerField(default='0', blank=True, null=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def save(self, *args, **kwargs):
        if self.email:
            self.email = self.email.lower()
            self.username = self.email.lower()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name}" if self.name else self.username

    class Meta:
        # ordering = ['-pk']
        verbose_name = 'User'
        verbose_name_plural = 'Users'


class ApprovalHistory(models.Model):
    user = models.ForeignKey('User', on_delete=models.CASCADE, related_name='approval_history')
    status = models.CharField(max_length=50, choices=STATUS, default='Pending Approval')
    valid_date = models.DateField(blank=True, null=True)
    founder_member_amount = models.CharField(max_length=255, blank=True, null=True)
    tsr_name = models.CharField(max_length=255, blank=True, null=True)
    action_date = models.DateField(blank=True, null=True)

    def __str__(self):
        return f"Status: {self.status}, Amount: {self.founder_member_amount}, Valid Date: {self.valid_date}, TSR: {self.tsr_name}, Action Date: {self.action_date},"


class SalesmanUser(User):
    class Meta:
        proxy = True
        verbose_name = 'Salesman'
        verbose_name_plural = 'Salesmens'


class AuthSession(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    ip_address = models.CharField(max_length=45)
    user_agent = models.TextField()
    token_jti = models.TextField(unique=True)
    is_active = models.BooleanField(default=True)
    invalidated_at = models.DateTimeField(null=True, blank=True)
    invalidation_reason = models.CharField(max_length=100, blank=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['user', 'is_active']),
            models.Index(fields=['token_jti']),
            models.Index(fields=['invalidated_at']),
        ]
        ordering = ['-created_at']

    @classmethod
    def create_login_record(cls, user, token_jti, request):
        """Create a new login session record"""
        return cls.objects.create(
            user=user,
            ip_address=cls.get_client_ip(request),
            user_agent=request.META.get('HTTP_USER_AGENT', ''),
            token_jti=token_jti
        )

    @classmethod
    def invalidate_previous_tokens(cls, user, reason='new_login'):
        """Mark all previous active tokens as invalid"""
        active_sessions = cls.objects.filter(user=user, is_active=True)
        active_sessions.update(
            is_active=False,
            invalidated_at=timezone.now(),
            invalidation_reason=reason
        )
        return active_sessions

    @classmethod
    def is_valid_token(cls, token_jti):
        """Check if a token is still valid"""
        return cls.objects.filter(token_jti=token_jti, is_active=True).exists()

    @staticmethod
    def get_client_ip(request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

