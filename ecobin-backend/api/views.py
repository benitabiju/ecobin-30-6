from rest_framework.decorators import action
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import get_user_model
from django.conf import settings
from django.core.mail import send_mail

from .serializers import CitizenRegistrationSerializer
from .permissions import IsCitizen, IsCollector, IsStaffOrAdmin as IsAdminUserRole

User = get_user_model()

class RegisterCitizenView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = CitizenRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            user = serializer.instance
            from rest_framework_simplejwt.tokens import RefreshToken
            refresh = RefreshToken.for_user(user)
            return Response(
                {
                    "message": "Citizen registered successfully.",
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminCreateStaffView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserRole]

    def post(self, request):
        data = request.data
        try:
            allowed_roles = ['collector', 'admin']
            target_role = data.get('role')
            
            if target_role not in allowed_roles:
                return Response({"error": "Invalid role assignment."}, status=status.HTTP_400_BAD_REQUEST)
                
            user = User.objects.create_user(
                email=data['email'],
                full_name=data['full_name'],
                phone=data['phone'],
                password=data['password'],
                address=data.get('address', ''),
                role=target_role
            )
            
            # If the created staff is a collector, automatically generate their Collector profile
            if target_role == 'collector':
                from .models import Collector
                Collector.objects.create(
                    user=user,
                    availability='available',
                    assigned_area=data.get('address', 'Unassigned Zone')
                )
                
            return Response(
                {"message": f"Staff user with role '{target_role}' created successfully."}, 
                status=status.HTTP_201_CREATED
            )
        except KeyError as e:
            return Response({"error": f"Missing required field: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import (
    PickupRequest, Collection, Recycling, Feedback, AuditLog,
    Notification, WasteCategory, CompoundCleanup, StreetCleanup
)
from .serializers import (
    PickupRequestSerializer, WasteCategorySerializer,
    CompoundCleanupSerializer, StreetCleanupSerializer,
    FeedbackSerializer,
)
from .permissions import IsCollector, IsStaffOrAdmin, IsCitizen
from . import services


class WasteCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = WasteCategory.objects.all()
    serializer_class = WasteCategorySerializer
    permission_classes = [AllowAny]


class PickupRequestViewSet(viewsets.ModelViewSet):
    serializer_class = PickupRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'citizen':
            return PickupRequest.objects.filter(user=user)
        elif user.role == 'collector':
            return PickupRequest.objects.filter(assigned_collector__user=user)
        return PickupRequest.objects.all()

    def perform_create(self, serializer):
        user = self.request.user

        # ── Rule 5: Gate — citizen must rate before submitting new requests ──
        if user.role == 'citizen':
            pending_rating_exists = PickupRequest.objects.filter(
                user=user, pending_rating=True
            ).exists()
            if pending_rating_exists:
                from rest_framework.exceptions import PermissionDenied
                raise PermissionDenied(
                    "You must rate your last completed collection before submitting a new pickup request."
                )

        pickup = serializer.save(user=user)
        
        # Save citizen images
        images = self.request.FILES.getlist('images')
        if not images and self.request.FILES.get('images[]'):
            images = self.request.FILES.getlist('images[]')
            
        from .models import PickupImage
        for image in images:
            PickupImage.objects.create(
                request=pickup,
                image=image,
                image_type='citizen_upload',
                uploader=user
            )
            
        # Notify citizen
        Notification.objects.create(
            user=user,
            title='Pickup Request Submitted',
            message=f'Your pickup request {pickup.request_id} has been submitted and is pending admin review.'
        )

        # ── Rule 1: Compound Cleanup Trigger ──
        services.check_compound_cleanup_trigger(user)

        # ── Rule 2: Street Cleanup Trigger ──
        if pickup.street:
            services.check_street_cleanup_trigger(pickup.street)

    def destroy(self, request, *args, **kwargs):
        pickup = self.get_object()
        user = request.user
        
        if user.role == 'citizen':
            if pickup.user != user:
                return Response({"error": "Not authorized."}, status=status.HTTP_403_FORBIDDEN)
            if pickup.status not in ['pending_assignment', 'pending_review']:
                return Response({"error": "Cannot delete a request that is no longer pending."}, status=status.HTTP_400_BAD_REQUEST)
                
        elif user.role in ['admin', 'staff']:
            reason = request.data.get('reason') or request.query_params.get('reason')
            if not reason:
                return Response({"error": "Admin must provide a reason for deletion. Pass it as a 'reason' query parameter or in the request body."}, status=status.HTTP_400_BAD_REQUEST)
            
            Notification.objects.create(
                user=pickup.user,
                title="Pickup Request Deleted",
                message=f"Your pickup request (ID: {str(pickup.request_id)[:8]}) was deleted by an admin. Reason: {reason}"
            )
        else:
            return Response({"error": "Not authorized."}, status=status.HTTP_403_FORBIDDEN)
            
        return super().destroy(request, *args, **kwargs)

    # PATCH /api/v1/pickups/{id}/assign/
    @action(detail=True, methods=['patch'], permission_classes=[IsStaffOrAdmin])
    def assign(self, request, pk=None):
        from .models import Collector
        pickup = self.get_object()
        collector_id = request.data.get('collector_id')

        if not collector_id:
            return Response({"error": "collector_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Validate that the collector exists
        try:
            collector = Collector.objects.select_related('user').get(collector_id=collector_id)
        except Collector.DoesNotExist:
            return Response({"error": "Collector not found"}, status=status.HTTP_404_NOT_FOUND)

        if pickup.status not in ['pending_assignment', 'assigned', 'pending_review', 'approved']:
            return Response({"error": f"Cannot assign a request in '{pickup.status}' status"}, status=status.HTTP_400_BAD_REQUEST)

        # Perform the assignment
        is_reassignment = pickup.assigned_collector is not None
        pickup.assigned_collector = collector
        pickup.status = 'assigned'
        pickup.save()

        # Notify the citizen whose request was assigned
        Notification.objects.create(
            user=pickup.user,
            title='Pickup Request Reassigned' if is_reassignment else 'Pickup Request Assigned',
            message=(
                f'Your pickup request has been assigned to '
                f'{collector.user.full_name}. They will contact you soon.'
            )
        )

        # Notify the collector about their new assignment
        Notification.objects.create(
            user=collector.user,
            title='New Pickup Assignment',
            message=(
                f'You have been assigned a new pickup request from '
                f'{pickup.user.full_name} scheduled on {pickup.pickup_date}.'
            )
        )

        # Log the administrative action to the audit log
        AuditLog.objects.create(
            user=request.user,
            action="assign_collector",
            target_entity="pickup_requests",
            target_id=str(pickup.request_id),
            details=f"Assigned collector {collector.user.full_name} ({collector_id}) to request {pickup.request_id}"
        )

        serializer = PickupRequestSerializer(pickup, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[IsStaffOrAdmin])
    def approve(self, request, pk=None):
        pickup = self.get_object()
        pickup.status = 'approved'
        pickup.save()
        Notification.objects.create(user=pickup.user, title='Request Approved', message='Your pickup request has been approved.')
        return Response(PickupRequestSerializer(pickup, context={'request': request}).data)

    @action(detail=True, methods=['post'], permission_classes=[IsStaffOrAdmin])
    def reject(self, request, pk=None):
        pickup = self.get_object()
        reason = request.data.get('reason', '')
        pickup.status = 'rejected'
        pickup.rejection_reason = reason
        pickup.save()
        Notification.objects.create(user=pickup.user, title='Request Rejected', message=f'Your pickup request was rejected. Reason: {reason}')
        return Response(PickupRequestSerializer(pickup, context={'request': request}).data)

    # ── Rule 6: Collector proof upload (collector ONLY) ──
    @action(detail=True, methods=['post'], permission_classes=[IsCollector])
    def upload_proof(self, request, pk=None):
        pickup = self.get_object()
        images = request.FILES.getlist('images')
        if not images and request.FILES.get('images[]'):
            images = request.FILES.getlist('images[]')
            
        if not images:
            return Response({"error": "At least one proof image is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        from .models import PickupImage
        for image in images:
            PickupImage.objects.create(
                request=pickup,
                image=image,
                image_type='collector_proof',
                uploader=request.user
            )
            
        from django.utils import timezone
        pickup.collector_completed_at = timezone.now()
        
        notes = request.data.get('notes', '')
        weight = request.data.get('weight')
        if weight:
            pickup.quantity = float(weight)
            
        pickup.status = 'pending_verification'
        pickup.save()

        from .models import Collection
        Collection.objects.update_or_create(
            request=pickup,
            defaults={
                'collector': pickup.assigned_collector,
                'collected_weight': float(weight) if weight else pickup.quantity,
                'remarks': notes
            }
        )
        
        Notification.objects.create(
            user=pickup.user,
            title='Action Required: Verify Pickup',
            message='The collector has marked your pickup as completed. Please upload a verification photo to confirm.'
        )
        return Response(PickupRequestSerializer(pickup, context={'request': request}).data)

    # ── Rule 6: Citizen verification photo upload (citizen ONLY) ──
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def citizen_verify(self, request, pk=None):
        pickup = self.get_object()
        
        # Enforce citizen ownership
        if pickup.user != request.user:
            return Response({"error": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)

        # Enforce citizen role — collectors cannot use this endpoint
        if request.user.role != 'citizen':
            return Response(
                {"error": "Only citizens can upload verification photos."},
                status=status.HTTP_403_FORBIDDEN
            )
            
        if pickup.status != 'pending_verification':
            return Response({"error": "Pickup is not pending verification"}, status=status.HTTP_400_BAD_REQUEST)

        images = request.FILES.getlist('images')
        if not images and request.FILES.get('images[]'):
            images = request.FILES.getlist('images[]')
            
        if not images:
            return Response({"error": "At least one verification image is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        from .models import PickupImage
        for image in images:
            PickupImage.objects.create(
                request=pickup,
                image=image,
                image_type='citizen_verification',
                uploader=request.user
            )
            
        # Leave status as pending_verification
        pickup.save()
        
        Notification.objects.create(
            user=pickup.user,
            title='Pickup Pending Admin Verification',
            message='Your verification has been submitted and is pending final admin approval.'
        )
        return Response(PickupRequestSerializer(pickup, context={'request': request}).data)
        
    @action(detail=True, methods=['post'], permission_classes=[IsStaffOrAdmin])
    def verify(self, request, pk=None):
        pickup = self.get_object()
        action_type = request.data.get('action')  # 'approve' or 'reject'
        reason = request.data.get('reason', '')
        
        if action_type == 'approve':
            from django.utils import timezone
            from datetime import timedelta
            
            has_citizen_verification = pickup.images.filter(image_type='citizen_verification').exists()
            collector_proof = pickup.images.filter(image_type='collector_proof').order_by('-uploaded_at').first()
            
            can_approve = False
            if has_citizen_verification:
                can_approve = True
            elif collector_proof:
                if timezone.now() - collector_proof.uploaded_at > timedelta(hours=72):
                    can_approve = True
                    
            if not can_approve:
                return Response(
                    {"error": "Cannot complete: Pending citizen verification and 72-hour auto-completion window has not elapsed."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            pickup.status = 'completed'
            # ── Rule 5: Set pending_rating so citizen must rate before next request ──
            pickup.pending_rating = True
            pickup.save()

            Notification.objects.create(
                user=pickup.user,
                title='Pickup Completed ✅',
                message=(
                    'Your pickup has been verified and completed. '
                    'Please rate your collector to unlock your next pickup request.'
                )
            )
            if pickup.assigned_collector:
                Notification.objects.create(
                    user=pickup.assigned_collector.user,
                    title='Completion Verified',
                    message=f'Your collection for {pickup.request_id} was verified.'
                )

            # ── Rule 3: If RECYCLABLE, increment recyclable counter and check bonus ──
            if pickup.category.disposal_category == 'RECYCLABLE' and pickup.assigned_collector:
                from django.db.models import F
                from .models import Collector
                Collector.objects.filter(pk=pickup.assigned_collector.pk).update(
                    total_recyclable_collections=F('total_recyclable_collections') + 1
                )
                pickup.assigned_collector.refresh_from_db()
                services.check_bonus_cycle(pickup.assigned_collector)

            # Create Recycling record if category is RECYCLABLE
            if pickup.category.disposal_category == 'RECYCLABLE':
                from .models import Collection, Recycling
                collection_obj = Collection.objects.filter(request=pickup).first()
                if collection_obj:
                    Recycling.objects.get_or_create(
                        collection=collection_obj,
                        defaults={
                            'recycled_weight': collection_obj.collected_weight,
                            'recycling_center': 'Central Recycling Facility',
                            'recycled_date': timezone.now().date()
                        }
                    )
            return Response({"status": "pickup completed"})
            
        elif action_type == 'reject':
            pickup.status = 'completion_rejected'
            pickup.rejection_reason = reason
            pickup.save()
            Notification.objects.create(
                user=pickup.user,
                title='Completion Rejected',
                message=f'Your verification was rejected. Reason: {reason}'
            )
            return Response({"status": "completion rejected"})
            
        return Response({"error": "Invalid action"}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], permission_classes=[IsStaffOrAdmin])
    def trigger_auto_complete(self, request):
        from django.core.management import call_command
        try:
            call_command('auto_complete_requests')
            return Response({"status": "Auto-completion triggered successfully"})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # PATCH /api/v1/pickup-requests/{id}/status/
    @action(detail=True, methods=['patch'], permission_classes=[IsCollector | IsStaffOrAdmin])
    def status(self, request, pk=None):
        pickup = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in ['pending', 'assigned', 'collected', 'recycled', 'cancelled']:
            return Response({"error": "Invalid status option"}, status=status.HTTP_400_BAD_REQUEST)
            
        pickup.status = new_status
        pickup.save()
        return Response(PickupRequestSerializer(pickup).data)

    # ── Rule 5: Submit feedback & rating after collection ──
    @action(detail=True, methods=['post'], permission_classes=[IsCitizen])
    def submit_feedback(self, request, pk=None):
        """
        Citizen submits rating + feedback for a completed pickup.
        Clears the pending_rating gate so they can submit new requests.
        Updates collector points.
        """
        pickup = self.get_object()

        # Authorization: only the pickup's owner
        if pickup.user != request.user:
            return Response({"error": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)

        # State guard: can only rate completed pickups with pending_rating
        if pickup.status != 'completed':
            return Response(
                {"error": "Can only submit feedback for completed pickups."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not pickup.pending_rating:
            return Response(
                {"error": "Feedback has already been submitted for this pickup."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate input
        rating = request.data.get('rating')
        comments = request.data.get('comments', '')

        if rating is None:
            return Response({"error": "rating is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            rating = int(rating)
        except (TypeError, ValueError):
            return Response({"error": "rating must be an integer."}, status=status.HTTP_400_BAD_REQUEST)

        if not (1 <= rating <= 5):
            return Response({"error": "Rating must be between 1 and 5."}, status=status.HTTP_400_BAD_REQUEST)

        if not comments.strip():
            return Response({"error": "Please provide feedback comments."}, status=status.HTTP_400_BAD_REQUEST)

        # Prevent duplicate feedback
        if Feedback.objects.filter(user=request.user, request=pickup).exists():
            return Response(
                {"error": "You have already submitted feedback for this pickup."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create feedback record
        Feedback.objects.create(
            user=request.user,
            request=pickup,
            rating=rating,
            comments=comments
        )

        # Clear the rating gate
        pickup.pending_rating = False
        pickup.save(update_fields=['pending_rating'])

        # Update collector points (Rule 5)
        if pickup.assigned_collector:
            services.update_collector_points(pickup.assigned_collector, rating)

        return Response({"status": "Feedback submitted successfully. You may now submit new pickup requests."})


from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from .models import Collector, Collection, Notification
from .serializers import CollectorProfileSerializer, UpdatePickupStatusSerializer, NotificationSerializer

class CollectorViewSet(viewsets.ModelViewSet):
    queryset = Collector.objects.all()
    serializer_class = CollectorProfileSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'], permission_classes=[IsStaffOrAdmin])
    def available(self, request):
        from .serializers import AssignedCollectorBriefSerializer
        collectors = Collector.objects.filter(availability='available')
        serializer = AssignedCollectorBriefSerializer(collectors, many=True)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        collector_to_delete = self.get_object()
        user_to_delete = collector_to_delete.user
        
        from .models import AuditLog
        AuditLog.objects.create(
            user=request.user,
            action="delete_collector",
            target_entity="collector",
            target_id=str(collector_to_delete.collector_id),
            details=f"Deleted collector profile and user {user_to_delete.email}"
        )
        
        # Deleting the user cascades to the collector profile automatically
        user_to_delete.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'admin':
            return self.queryset
        return self.queryset.filter(user=self.request.user)


from .models import SmartBin
from .serializers import SmartBinSerializer

class SmartBinViewSet(viewsets.ModelViewSet):
    queryset = SmartBin.objects.all()
    serializer_class = SmartBinSerializer
    permission_classes = [IsAuthenticated]

    # Custom simulated hardware uplink endpoint
    @action(detail=True, methods=['post'], url_path='update-fill-level')
    def update_fill_level(self, request, pk=None):
        bin_instance = self.get_object()
        fill_level = request.data.get('fill_level')
        
        if fill_level is None or float(fill_level) < 0:
            return Response({"detail": "Invalid fill level input data."}, status=status.HTTP_400_BAD_REQUEST)
            
        bin_instance.fill_level = float(fill_level)
        
        # Flag structural overflow thresholds
        if bin_instance.fill_level >= bin_instance.capacity:
            bin_instance.status = 'maintenance'
            
        bin_instance.save()
        return Response({"status": "Fill level updated", "current_fill_level": bin_instance.fill_level})

    
from .serializers import UserProfileSerializer

class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'admin':
            return self.queryset
        return self.queryset.filter(user_id=self.request.user.user_id)

    def check_permissions(self, request):
        super().check_permissions(request)
        if self.action in ['destroy', 'create'] and request.user.role != 'admin':
            self.permission_denied(request, message='Admin access required')

    def destroy(self, request, *args, **kwargs):
        user_to_delete = self.get_object()
        
        from .models import AuditLog
        AuditLog.objects.create(
            user=request.user,
            action="delete_user",
            target_entity="user",
            target_id=str(user_to_delete.user_id),
            details=f"Deleted user {user_to_delete.email} ({user_to_delete.role})"
        )
        return super().destroy(request, *args, **kwargs)

    @action(detail=False, methods=['get', 'put', 'patch'], url_path='me')
    def manage_profile(self, request):
        user = request.user
        if request.method == 'GET':
            serializer = UserProfileSerializer(user)
            return Response(serializer.data)
            
        elif request.method in ['PUT', 'PATCH']:
            serializer = UserProfileSerializer(user, data=request.data, partial=(request.method == 'PATCH'))
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


from .serializers import CollectionSerializer, RecyclingSerializer, FeedbackSerializer, AuditLogSerializer

class CollectionViewSet(viewsets.ModelViewSet):
    queryset = Collection.objects.all()
    serializer_class = CollectionSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(collector=self.request.user.collector_profile)

class RecyclingViewSet(viewsets.ModelViewSet):
    serializer_class = RecyclingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'admin':
            return Recycling.objects.all()
        # Citizens can only see their own recycling records linked via collection->request->user
        return Recycling.objects.filter(collection__request__user=self.request.user)

    def perform_create(self, serializer):
        # Ensure the collection belongs to the citizen if provided
        collection = serializer.validated_data.get('collection')
        if collection and collection.request.user != self.request.user:
            from rest_framework import serializers
            raise serializers.ValidationError('Cannot create recycling for another user')
        serializer.save()


class FeedbackViewSet(viewsets.ModelViewSet):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'admin':
            return self.queryset
        return self.queryset.filter(user=self.request.user)

class AuditLogViewSet(viewsets.ReadOnlyModelViewSet): 
    queryset = AuditLog.objects.all().order_by('-created_at')
    serializer_class = AuditLogSerializer
    permission_classes = [IsAdminUserRole]


# ── Rule 1: Compound Cleanup ViewSet ──
class CompoundCleanupViewSet(viewsets.ModelViewSet):
    """
    Admin can list, update status, and assign collectors for compound cleanups.
    Citizens can view their own compound cleanups.
    """
    serializer_class = CompoundCleanupSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return CompoundCleanup.objects.all().order_by('-triggered_at')
        # Citizens see only their own
        return CompoundCleanup.objects.filter(citizen=user).order_by('-triggered_at')

    def perform_update(self, serializer):
        # Detect status change to 'completed'
        old_status = self.get_object().status
        instance = serializer.save()

        # ── Rule 3: When admin completes a compound cleanup, credit the assigned collector ──
        if old_status != 'completed' and instance.status == 'completed':
            from django.utils import timezone
            from django.db.models import F
            instance.completed_at = timezone.now()
            instance.save(update_fields=['completed_at'])

            if instance.assigned_collector:
                Collector.objects.filter(pk=instance.assigned_collector.pk).update(
                    compound_cleanups_this_cycle=F('compound_cleanups_this_cycle') + 1
                )
                instance.assigned_collector.refresh_from_db()
                services.check_bonus_cycle(instance.assigned_collector)

                Notification.objects.create(
                    user=instance.citizen,
                    title='Compound Cleanup Completed ✅',
                    message=f'The compound cleanup for your premises has been marked as completed by {instance.assigned_collector.user.full_name}.'
                )


# ── Rule 2: Street Cleanup ViewSet ──
class StreetCleanupViewSet(viewsets.ModelViewSet):
    """
    Admin manages street cleanups. Citizens cannot access this.
    """
    serializer_class = StreetCleanupSerializer
    permission_classes = [IsAuthenticated, IsStaffOrAdmin]

    def get_queryset(self):
        return StreetCleanup.objects.all().order_by('-triggered_at')

    def perform_update(self, serializer):
        old_status = self.get_object().status
        instance = serializer.save()

        # ── Rule 3: When admin completes a street cleanup, credit the assigned collector ──
        if old_status != 'completed' and instance.status == 'completed':
            from django.utils import timezone
            from django.db.models import F
            instance.completed_at = timezone.now()
            instance.save(update_fields=['completed_at'])

            if instance.assigned_collector:
                Collector.objects.filter(pk=instance.assigned_collector.pk).update(
                    street_cleanups_this_cycle=F('street_cleanups_this_cycle') + 1
                )
                instance.assigned_collector.refresh_from_db()
                services.check_bonus_cycle(instance.assigned_collector)
