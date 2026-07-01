import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.conf import settings


# --- 1. USER MANAGER & CUSTOM USER MODEL ---
class UserManager(BaseUserManager):
    def create_user(self, email, full_name, phone, password=None, **extra_fields):
        if not email:
            raise ValueError("Users must have an email address")
        email = self.normalize_email(email)
        user = self.model(email=email, full_name=full_name, phone=phone, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, full_name, phone, password=None, **extra_fields):
        extra_fields.setdefault('role', 'admin')
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, full_name, phone, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = [
        ('citizen', 'Citizen'),
        ('collector', 'Collector'),
        ('admin', 'Admin'),
    ]

    user_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    full_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True, max_length=255)
    phone = models.CharField(max_length=20)
    address = models.TextField(blank=True, null=True)
    role = models.CharField(max_length=15, choices=ROLE_CHOICES, default='citizen')
    created_at = models.DateTimeField(auto_now_add=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name', 'phone']

    def __str__(self):
        return f"{self.email} ({self.role})"


# --- 2. WASTE CATEGORIES MODEL ---
class WasteCategory(models.Model):
    category_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    category_name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.category_name


# --- 3. SMART BINS MODEL ---
class SmartBin(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('maintenance', 'Maintenance'),
    ]

    bin_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    location = models.CharField(max_length=255)
    capacity = models.FloatField()
    fill_level = models.FloatField(default=0.0)
    latitude = models.FloatField()
    longitude = models.FloatField()
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='active')

    def __str__(self):
        return f"Bin {str(self.bin_id)[:8]} - {self.location}"


# --- 4. COLLECTORS PROFILE MODEL ---
class Collector(models.Model):
    AVAILABILITY_CHOICES = [
        ('available', 'Available'),
        ('unavailable', 'Unavailable'),
        ('on_route', 'On Route'),
    ]

    collector_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.PROTECT, related_name='collector_profile')
    vehicle_number = models.CharField(max_length=50, blank=True, null=True)
    assigned_area = models.CharField(max_length=255, blank=True, null=True)
    availability = models.CharField(max_length=20, choices=AVAILABILITY_CHOICES, default='available')

    def __str__(self):
        return f"Collector: {self.user.full_name} ({self.assigned_area or 'No Area'})"


# --- 5. PICKUP REQUESTS MODEL ---
class PickupRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('assigned', 'Assigned'),
        ('collected', 'Collected'),
        ('recycled', 'Recycled'),
        ('cancelled', 'Cancelled'),
    ]

    request_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.PROTECT, related_name='pickup_requests')
    bin = models.ForeignKey(SmartBin, on_delete=models.SET_NULL, null=True, blank=True)
    category = models.ForeignKey(WasteCategory, on_delete=models.PROTECT)
    assigned_collector = models.ForeignKey(Collector, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_requests')
    quantity = models.FloatField()
    pickup_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Request {str(self.request_id)[:8]} - {self.status}"


# --- 6. COLLECTIONS MODEL ---
class Collection(models.Model):
    collection_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    request = models.OneToOneField(PickupRequest, on_delete=models.PROTECT, related_name='collection_record')
    collector = models.ForeignKey(Collector, on_delete=models.PROTECT, related_name='collections_made')
    collection_date = models.DateField(auto_now_add=True)
    collected_weight = models.FloatField()
    remarks = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Collection {str(self.collection_id)[:8]} - Weight: {self.collected_weight}kg"


# --- 7. RECYCLING MODEL ---
class Recycling(models.Model):
    recycle_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    collection = models.OneToOneField(Collection, on_delete=models.PROTECT, related_name='recycling_record')
    recycled_weight = models.FloatField()
    recycling_center = models.CharField(max_length=255)
    recycled_date = models.DateField()

    def __str__(self):
        return f"Recycle Record {str(self.recycle_id)[:8]} at {self.recycling_center}"


# --- 8. FEEDBACK MODEL ---
class Feedback(models.Model):
    feedback_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='feedbacks')
    collection = models.ForeignKey(Collection, on_delete=models.SET_NULL, null=True, blank=True, related_name='feedbacks')
    rating = models.IntegerField()
    comments = models.TextField()
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Feedback {str(self.feedback_id)[:8]} - Rating: {self.rating}"


# --- 9. NOTIFICATIONS MODEL ---
class Notification(models.Model):
    notification_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=255)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification to {self.user.email}: {self.title}"


# --- 10. AUDIT LOG MODEL ---
class AuditLog(models.Model):
    log_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    action = models.CharField(max_length=255)
    target_entity = models.CharField(max_length=100, blank=True, null=True)
    target_id = models.CharField(max_length=255, blank=True, null=True)
    details = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Log {self.action} by User {self.user}"


# --- 11. PASSWORD RESET TOKENS MODEL ---
class PasswordResetToken(models.Model):
    token_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token_hash = models.CharField(max_length=255)
    expires_at = models.DateTimeField()
    used = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Reset Token for {self.user.email}"
