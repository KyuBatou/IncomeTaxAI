from ckeditor.fields import RichTextField
from django.utils.text import slugify
from django.conf import settings
from django.db import models

from login_auth.models import User


class FAQ(models.Model):

    question = models.CharField(max_length=255)
    answer = models.TextField()

    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.question

class ContactMessage(models.Model):
    name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=50)
    subject = models.CharField(max_length=200, blank=True, null=True)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} - {self.subject}"

class PricingPlan(models.Model):
    name = models.CharField(max_length=100, default="")
    services = models.CharField(max_length=100, default="")
    monthly_price = models.CharField(max_length=50, default="")
    yearly_price = models.CharField(max_length=50, default="")
    icon = models.ImageField(upload_to="pricing_icons/", default="")
    is_popular = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.name

class PricingFeature(models.Model):
    plan = models.ForeignKey(PricingPlan, on_delete=models.CASCADE, related_name="features")
    feature_text = models.CharField(max_length=200)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.plan.name} - {self.feature_text}"

class Service(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    icon_link = models.CharField(max_length=100, default="")
    link_url = models.CharField(max_length=200)
    order = models.PositiveIntegerField(default=0)
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title

class CounterBoard(models.Model):
    title = models.CharField(max_length=200)
    count = models.CharField(max_length=50)

    def __str__(self):
        return self.title

class RoadmapStep(models.Model):
    number = models.PositiveIntegerField()
    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField(upload_to='roadmap/')
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.number} - {self.title}"

class Banner(models.Model):
    title_prefix = models.CharField(max_length=200)

    word_one = models.CharField(max_length=100)
    word_two = models.CharField(max_length=100)

    description = models.TextField()

    button_one_text = models.CharField(max_length=100)
    button_one_link = models.CharField(max_length=200)

    button_two_text = models.CharField(max_length=100, null=True, blank=True)
    button_two_link = models.CharField(max_length=200, null=True, blank=True)

    video_mp4 = models.FileField(upload_to="banner_videos/")
    video_ogg = models.FileField(upload_to="banner_videos/", blank=True, null=True)

    def __str__(self):
        return "Homepage Banner"

class LegalContent(models.Model):

    section = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    legal_content = RichTextField(blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.section)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.section

class TblPayment(models.Model):
    email_id = models.CharField(max_length=255, blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True, related_name='user_payemnt')
    name = models.CharField(max_length=255, blank=True, null=True)
    mobile_no = models.CharField(max_length=100, blank=True, null=True)
    company_name = models.TextField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    legal_name = models.TextField(blank=True, null=True)
    gstin = models.CharField(max_length=255, blank=True, null=True)
    booked_by = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True, related_name='booked_salesman')
    product_name = models.CharField(max_length=255, blank=True, null=True)
    order_number = models.CharField(max_length=255, blank=True, null=True)
    order_date = models.DateField(auto_now_add=True, blank=True, null=True)
    amount = models.CharField(max_length=255, blank=True, null=True)
    gst = models.CharField(max_length=15, blank=True, null=True)
    gst_amount = models.TextField(blank=True, null=True)
    payable_amount = models.CharField(max_length=255, blank=True, null=True)
    txnid = models.CharField(max_length=255, blank=True, null=True)
    bank_txnid = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=255, blank=True, null=True)
    resp_code = models.CharField(max_length=255, blank=True, null=True)
    payment_mode = models.CharField(max_length=255, blank=True, null=True)
    bank_name = models.CharField(max_length=255, blank=True, null=True)
    gateway_name = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        ordering = ['-pk']
        verbose_name = 'Payment'
        verbose_name_plural = 'Payments'

    def __str__(self):
        return self.order_number
    class Meta:
        ordering = ['-pk']
        verbose_name = 'Payment'
        verbose_name_plural = 'Payments'


class AiChatSession(models.Model):
    class ModelType(models.TextChoices):
        ASK_BOT = "ask_bot", "Ask Bot"
        CASE_LAW_RESEARCH = "case_law_research", "Case Law Research"
        SUMMARIZER = "summarizer", "Summarizer"
        DRAFT_ASSISTANT = "draft_assistant", "Draft Assistant"

    title = models.CharField(max_length=250, default="New Chat")
    session_token = models.CharField(max_length=64, unique=True, db_index=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True, related_name='user_sessions')
    model_type = models.CharField(
        max_length=30,
        choices=ModelType.choices,
        default=ModelType.ASK_BOT,
        db_index=True,
    )
    category = models.IntegerField(default=1)
    metadata = models.JSONField(default=dict, blank=True)
    message_count = models.IntegerField(default=0)
    started_at = models.DateTimeField(auto_now_add=True)
    last_activity = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [models.Index(fields=["session_token"], name="idx_sessions_token")]

    def __str__(self): return self.session_token


class AiChatMessage(models.Model):
    SOURCE_CHOICES = [("main","Main"),("premium","Premium"),("free","Free")]

    session = models.ForeignKey(AiChatSession, on_delete=models.CASCADE, related_name="messages")
    user_query = models.TextField()
    ai_answer = models.TextField()
    source_bot = models.CharField(max_length=30, choices=SOURCE_CHOICES, default="main")
    is_detailed = models.BooleanField(default=False)
    planner_output = models.JSONField(null=True, blank=True)
    sources_used = models.JSONField(null=True, blank=True)
    sources_shown = models.JSONField(null=True, blank=True)
    web_context = models.TextField(null=True, blank=True)
    verification = models.JSONField(null=True, blank=True)
    was_resynthesized = models.BooleanField(default=False)
    confidence = models.FloatField(default=0.0)
    query_time_ms = models.IntegerField(default=0)
    web_search_used = models.BooleanField(default=True)
    max_results = models.IntegerField(default=5)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self): return f"Message {self.pk} - Session {self.session.pk}"
# Create your models here.
