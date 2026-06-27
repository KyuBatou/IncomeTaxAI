from django.contrib import admin
from .models import (
    FAQ,
    AiChatMessage,
    AiChatSession,
    ContactMessage,
    PricingPlan,
    PricingFeature,
    Service,
    RoadmapStep,
    CounterBoard,
    Banner,
    LegalContent,
    TblPayment,
)



@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ('question', 'order', 'is_active')
    ordering = ('order', )



@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'email',
        'phone',
        'subject',
        'created_at',
        'is_read',
    )

    list_filter = ('is_read', 'created_at')
    search_fields = ('name', 'email', 'subject')
    list_editable = ('is_read',)
    ordering = ('-created_at',)

    readonly_fields = ('created_at',)

    fieldsets = (
        ('User Information', {
            'fields': ('name', 'email', 'phone')
        }),
        ('Message Details', {
            'fields': ('subject', 'message')
        }),
        ('Status', {
            'fields': ('is_read', 'created_at')
        }),
    )


class PricingFeatureInline(admin.TabularInline):
    model = PricingFeature
    extra = 1

@admin.register(PricingPlan)
class PricingPlanAdmin(admin.ModelAdmin):
    list_display = ("name", "monthly_price", "yearly_price", "is_popular", "order")
    inlines = [PricingFeatureInline]



@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('title', 'link_url', 'order', 'is_featured')
    list_editable = ('order', 'is_featured')
    search_fields = ('title', 'description')
    ordering = ('order',)

@admin.register(RoadmapStep)
class RoadmapStepAdmin(admin.ModelAdmin):
    list_display = ('number', 'title', 'order')
    ordering = ('order',)


@admin.register(CounterBoard)
class CounterBoardAdmin(admin.ModelAdmin):
    list_display = ('title', 'count')
    ordering = ('id',)

@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):

    def has_add_permission(self, request):
        if Banner.objects.exists():
            return False
        return True


@admin.register(LegalContent)
class LegalContentAdmin(admin.ModelAdmin):
    list_display = ('section', 'slug', 'updated_at')
    prepopulated_fields = {'slug': ('section',)}
    search_fields = ('section', 'legal_content')
    list_filter = ('updated_at',)


@admin.register(TblPayment)
class TblPaymentAdmin(admin.ModelAdmin):
    actions = None

    list_display = ( 'order_date', 'status', 'email_id', 'name', 'company_name', 'city', 'state', 'legal_name', 'product_name', 
        'order_number', 'amount', 'payable_amount', 'txnid', 'bank_txnid', )
    list_display_links = ('order_date', 'status', 'email_id', 'name', 'company_name', 'city', 'state', 'legal_name', 'product_name', 
        'order_number', 'amount', 'payable_amount', 'txnid', 'bank_txnid')
    search_fields = ('email_id',)

    readonly_fields = [field.name for field in TblPayment._meta.fields]


    def city(self, obj):
        return obj.user.city if obj.user and hasattr(obj.user, 'city') else '-'
    def state(self, obj):
        return obj.user.state if obj.user and hasattr(obj.user, 'state') else '-'

    def get_queryset(self, request):
        self.request = request
        return super().get_queryset(request)


class AiChatSessionAdmin(admin.ModelAdmin):
    list_display = ('title', 'session_token', 'user', 'category', 'message_count', 'started_at', 'last_activity')
    search_fields = ('title', 'session_token', 'user__username')  # You can search by title, session_token, and user username
    list_filter = ('category', 'started_at', 'last_activity')  # Filter by category, start date, and last activity date
    ordering = ['-started_at']  # Display sessions starting with the most recent one
    readonly_fields = ('session_token', 'started_at', 'last_activity')  # Make certain fields read-only

    # Optionally, you can add inline message display
    inlines = []

admin.site.register(AiChatSession, AiChatSessionAdmin)


# Admin configuration for AiChatMessage
class AiChatMessageAdmin(admin.ModelAdmin):
    list_display = ('session', 'user_query', 'ai_answer', 'source_bot', 'created_at', 'confidence', 'was_resynthesized')
    search_fields = ('user_query', 'ai_answer', 'session__session_token')  # Search by user query, AI answer, and session token
    list_filter = ('source_bot', 'is_detailed', 'created_at', 'confidence')  # Filter by source, detail, creation date, and confidence
    ordering = ['-created_at']  # Display messages starting with the most recent one
    readonly_fields = ('session', 'created_at')  # Make certain fields read-only
    raw_id_fields = ('session',)  # You can use a raw ID field to select sessions more efficiently

admin.site.register(AiChatMessage, AiChatMessageAdmin)