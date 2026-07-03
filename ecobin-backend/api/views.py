from rest_framework.decorators import action
from rest_framework import status
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
from rest_framework.permissions import IsAuthenticated
from .models import PickupRequest, Collection, Recycling, Feedback, AuditLog, Notification
from .serializers import PickupRequestSerializer # Assuming your serializers match fields
from .permissions import IsCollector, IsStaffOrAdmin, IsCitizen

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
        pickup = serializer.save(user=self.request.user)
        # Create a notification for the citizen who submitted the pickup request
        Notification.objects.create(
            user=self.request.user,
            title='Pickup Request Submitted',
            message=f'Your pickup request {pickup.request_id} has been submitted.'
        )

    # PATCH /api/v1/pickup-requests/{id}/assign/
    @action(detail=True, methods=['patch'], permission_classes=[IsStaffOrAdmin])
    def assign(self, request, pk=None):
        pickup = self.get_object()
        collector_id = request.data.get('collector_id')
        
        if not collector_id:
            return Response({"error": "collector_id is required"}, status=status.HTTP_400_BAD_REQUEST)
            
        pickup.assigned_collector_id = collector_id
        pickup.status = 'assigned'
        pickup.save()
        
        # Log the administrative shift to the audit log
        AuditLog.objects.create(
            user=request.user,
            action="assign_collector",
            target_entity="pickup_requests",
            target_id=str(pickup.request_id),
            details=f"Assigned collector {collector_id}"
        )
        return Response(PickupRequestSerializer(pickup).data)

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
    

from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from .models import Collector, Collection, Notification
from .serializers import CollectorProfileSerializer, UpdatePickupStatusSerializer, NotificationSerializer

class CollectorViewSet(viewsets.ModelViewSet):
    queryset = Collector.objects.all()
    serializer_class = CollectorProfileSerializer
    permission_classes = [IsAuthenticated]

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

# Add custom route assignment logic inside your existing PickupRequestViewSet
# Update your existing PickupRequestViewSet class to include these actions:

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

class UserProfileViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        if request.user.role != 'admin':
            from rest_framework import status
            return Response({"error": "Admin access required"}, status=status.HTTP_403_FORBIDDEN)
        users = User.objects.all()
        serializer = UserProfileSerializer(users, many=True)
        return Response(serializer.data)

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

class AuditLogViewSet(viewsets.ReadOnlyModelViewSet): 
    queryset = AuditLog.objects.all().order_by('-created_at')
    serializer_class = AuditLogSerializer
    permission_classes = [IsAdminUserRole]







class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        
        if not old_password or not new_password:
            return Response({"error": "Old and new passwords are required"}, status=status.HTTP_400_BAD_REQUEST)
            
        user = request.user
        if not user.check_password(old_password):
            return Response({"error": "Incorrect old password"}, status=status.HTTP_400_BAD_REQUEST)
            
        user.set_password(new_password)
        user.save()
        
        return Response({"message": "Password changed successfully."}, status=status.HTTP_200_OK)
