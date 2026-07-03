from . import views
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import (
    RegisterCitizenView, 
    AdminCreateStaffView, 
    PickupRequestViewSet,
    CollectorViewSet,
    SmartBinViewSet,
    UserProfileViewSet,
    NotificationViewSet
)

# 1. Set up the router and register all resource viewsets
router = DefaultRouter()
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'pickups', PickupRequestViewSet, basename='pickup')
router.register(r'collectors', CollectorViewSet, basename='collector')
router.register(r'smart-bins', SmartBinViewSet, basename='smartbin')
router.register(r'users', UserProfileViewSet, basename='user-profile')
router.register(r'collections', views.CollectionViewSet, basename='collection')
router.register(r'recycling', views.RecyclingViewSet, basename='recycling')
router.register(r'feedback', views.FeedbackViewSet, basename='feedback')
router.register(r'audit-logs', views.AuditLogViewSet, basename='audit-log')

# 2. Complete URL structure maps
urlpatterns = [
    # Router Resource Paths (Pickups, Collectors, Smart Bins, Profiles)
    path('', include(router.urls)),

    # Global Authentication Interface System Endpoints
    path('auth/register/', RegisterCitizenView.as_view(), name='auth_register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='auth_login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/create-staff/', AdminCreateStaffView.as_view(), name='admin_create_staff'),
    
    # Password Reset & Change Endpoints
# Password reset endpoints removed as per requirement
    path('auth/password/change/', views.ChangePasswordView.as_view(), name='password_change'),
]