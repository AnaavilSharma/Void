from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TripViewSet, HouseholdViewSet

router = DefaultRouter()
router.register(r'trips', TripViewSet)
router.register(r'households', HouseholdViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
