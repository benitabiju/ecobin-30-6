from django import forms
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import (
    User, WasteCategory, SmartBin, Collector, 
    PickupRequest, Collection, Recycling, Feedback, 
    Notification, AuditLog, PasswordResetToken,
    CompoundCleanup, StreetCleanup,
)

class CustomUserCreationForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput)

    class Meta:
        model = User
        fields = ('email', 'full_name', 'phone', 'password', 'role', 'is_staff', 'is_active')

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password"])
        if commit:
            user.save()
        return user

# Custom configuration for managing your UUID-based Custom User Model
@admin.register(User)
class UserAdmin(BaseUserAdmin):
    add_form = CustomUserCreationForm
    # Using 'user_id' instead of default 'id' since it's a UUID field
    ordering = ('email',)
    list_display = ('email', 'full_name', 'role', 'is_staff', 'is_active')
    list_filter = ('role', 'is_staff', 'is_active')
    
    # Structure of the user detail page in admin panel
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('full_name', 'phone', 'address')}),
        ('Permissions', {'fields': ('role', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    )
    
    # Fields required during user creation via admin interface
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'full_name', 'phone', 'password', 'role', 'is_staff', 'is_active'),
        }),
    )
    search_fields = ('email', 'full_name', 'phone')

# Registering the rest of EcoBin's models for full dashboard visibility
@admin.register(SmartBin)
class SmartBinAdmin(admin.ModelAdmin):
    list_display = ('bin_id', 'location', 'capacity', 'fill_level', 'status')
    list_filter = ('status',)
    search_fields = ('location',)

@admin.register(Collector)
class CollectorAdmin(admin.ModelAdmin):
    list_display = (
        'collector_id', 'get_collector_name', 'assigned_area', 'availability',
        'points', 'bonus_amount', 'bonus_cycles_completed', 'increment_qualified',
    )
    list_filter = ('availability', 'increment_qualified')
    search_fields = ('user__full_name', 'assigned_area', 'vehicle_number')
    readonly_fields = (
        'points', 'ratings_count', 'bonus_amount',
        'total_recyclable_collections', 'compound_cleanups_this_cycle',
        'street_cleanups_this_cycle', 'bonus_cycles_completed',
    )
    fieldsets = (
        (None, {'fields': ('user', 'vehicle_number', 'assigned_area', 'availability')}),
        ('Performance & Bonus (Rules 3–5)', {
            'fields': (
                'points', 'ratings_count', 'bonus_amount',
                'total_recyclable_collections', 'compound_cleanups_this_cycle',
                'street_cleanups_this_cycle', 'bonus_cycles_completed', 'increment_qualified',
            )
        }),
    )

    @admin.display(description='Collector Name')
    def get_collector_name(self, obj):
        return obj.user.full_name

@admin.register(PickupRequest)
class PickupRequestAdmin(admin.ModelAdmin):
    list_display = ('request_id', 'get_user_email', 'category', 'pickup_date', 'status', 'pending_rating')
    list_filter = ('status', 'pickup_date', 'pending_rating')
    search_fields = ('user__email', 'request_id', 'street')

    @admin.display(description='User Email')
    def get_user_email(self, obj):
        return obj.user.email


@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('feedback_id', 'user', 'get_request_id', 'rating', 'submitted_at')
    list_filter = ('rating',)
    search_fields = ('user__email',)

    @admin.display(description='Pickup Request')
    def get_request_id(self, obj):
        if obj.request:
            return str(obj.request.request_id)[:8]
        return '—'


# --- Rule 1: Compound Cleanup Admin ---
@admin.register(CompoundCleanup)
class CompoundCleanupAdmin(admin.ModelAdmin):
    list_display = (
        'compound_cleanup_id', 'get_citizen_name', 'status',
        'trigger_request_count', 'triggered_at', 'completed_at',
        'assigned_collector',
    )
    list_filter = ('status',)
    search_fields = ('citizen__full_name', 'citizen__email')
    raw_id_fields = ('citizen', 'assigned_collector')

    @admin.display(description='Citizen')
    def get_citizen_name(self, obj):
        return obj.citizen.full_name


# --- Rule 2: Street Cleanup Admin ---
@admin.register(StreetCleanup)
class StreetCleanupAdmin(admin.ModelAdmin):
    list_display = (
        'street_cleanup_id', 'street', 'status',
        'trigger_request_count', 'triggered_at', 'completed_at',
        'assigned_collector',
    )
    list_filter = ('status',)
    search_fields = ('street',)
    raw_id_fields = ('assigned_collector',)


# Register remaining utility models
admin.site.register(WasteCategory)
admin.site.register(Collection)
admin.site.register(Recycling)
admin.site.register(Notification)
admin.site.register(AuditLog)
admin.site.register(PasswordResetToken)