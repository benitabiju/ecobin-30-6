from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class CitizenRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['user_id', 'full_name', 'email', 'phone', 'address', 'password']

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def create(self, validated_data):
        # Explicitly enforce the 'citizen' role regardless of incoming data
        user = User.objects.create_user(
            email=validated_data['email'],
            full_name=validated_data['full_name'],
            phone=validated_data['phone'],
            password=validated_data['password'],
            address=validated_data.get('address', ''),
            role='citizen'
        )
        return user
    

from .models import PickupRequest, WasteCategory

class WasteCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = WasteCategory
        fields = ['category_id', 'category_name', 'description', 'icon', 'disposal_category', 'items']


class CitizenBriefSerializer(serializers.Serializer):
    """Lightweight citizen info embedded in pickup requests (read-only)."""
    user_id = serializers.UUIDField()
    full_name = serializers.CharField()
    email = serializers.EmailField()
    phone = serializers.CharField()


class AssignedCollectorBriefSerializer(serializers.Serializer):
    """Lightweight collector info embedded in pickup requests (read-only)."""
    collector_id = serializers.UUIDField()
    full_name = serializers.SerializerMethodField()
    email = serializers.SerializerMethodField()
    phone = serializers.SerializerMethodField()
    availability = serializers.CharField()
    assigned_area = serializers.CharField()

    def get_full_name(self, obj):
        return obj.user.full_name if obj.user else ''

    def get_email(self, obj):
        return obj.user.email if obj.user else ''

    def get_phone(self, obj):
        return obj.user.phone if obj.user else ''


class PickupRequestSerializer(serializers.ModelSerializer):
    # Automatically tracks who is logged in without prompting for the user ID in the body
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    
    # Nested representation for viewing, but accept UUID write targets
    category_detail = WasteCategorySerializer(source='category', read_only=True)
    
    # Rich citizen info so collectors/admins see who made the request
    user_detail = serializers.SerializerMethodField(read_only=True)
    
    # Rich collector info so citizens/admins see who is assigned
    assigned_collector_detail = AssignedCollectorBriefSerializer(
        source='assigned_collector', read_only=True
    )

    class Meta:
        model = PickupRequest
        fields = [
            'request_id', 'user', 'user_detail', 'bin', 'category', 'category_detail',
            'assigned_collector', 'assigned_collector_detail',
            'quantity', 'pickup_date', 'status', 
            'address', 'latitude', 'longitude', 'created_at'
        ]
        read_only_fields = ['request_id', 'assigned_collector', 'status', 'created_at']

    def get_user_detail(self, obj):
        u = obj.user
        if not u:
            return None
        return {
            'user_id': str(u.user_id),
            'full_name': u.full_name,
            'email': u.email,
            'phone': u.phone,
        }

    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError("Quantity must be greater than 0 kg.")
        return value

from .models import Collector

class CollectorProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    full_name = serializers.CharField(source='user.full_name', read_only=True)

    class Meta:
        model = Collector
        fields = ['collector_id', 'email', 'full_name', 'vehicle_number', 'assigned_area', 'availability']
        read_only_fields = ['collector_id']

class UpdatePickupStatusSerializer(serializers.Serializer):
    # Used when an action takes place on a request
    status = serializers.ChoiceField(choices=['assigned', 'collected', 'cancelled'])

from .models import SmartBin

class SmartBinSerializer(serializers.ModelSerializer):
    class Meta:
        model = SmartBin
        fields = ['bin_id', 'location', 'capacity', 'fill_level', 'latitude', 'longitude', 'status']

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['user_id', 'email', 'full_name', 'phone', 'address', 'role', 'created_at']
        read_only_fields = ['user_id', 'email', 'role', 'created_at']

from rest_framework import serializers
from .models import Notification, Collection, Recycling, Feedback, AuditLog, PasswordResetToken

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['notification_id', 'title', 'message', 'is_read', 'created_at']
        read_only_fields = ['notification_id', 'created_at']

class CollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Collection
        fields = '__all__'

class RecyclingSerializer(serializers.ModelSerializer):
    # Expose a consistent `recycling_id` field derived from the model's `recycle_id`
    recycling_id = serializers.UUIDField(source='recycle_id', read_only=True)
    # collection is optional for citizen submissions
    collection = serializers.PrimaryKeyRelatedField(read_only=True, required=False)
    class Meta:
        model = Recycling
        fields = ['recycling_id', 'collection', 'recycled_weight', 'recycling_center', 'recycled_date']
        read_only_fields = ['recycling_id']

class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = '__all__'
        
    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be an integer between 1 and 5.")
        return value

class AuditLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditLog
        fields = '__all__'
        read_only_fields = ['created_at']

class PasswordResetTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = PasswordResetToken
        fields = '__all__'