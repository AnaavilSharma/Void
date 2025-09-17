from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from .models import Trip, AccompanyingTraveler, RoutePoint, TripMetadata
from .serializers import TripSerializer, TripCreateSerializer, AccompanyingTravelerSerializer, RoutePointSerializer
from users.models import Household
from users.serializers import HouseholdSerializer


class TripViewSet(viewsets.ModelViewSet):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Trip.objects.filter(user=self.request.user).order_by('-start_time')
    
    def get_serializer_class(self):
        if self.action == 'create':
            return TripCreateSerializer
        return TripSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def active_trips(self, request):
        """Get currently active trips for the user"""
        active_trips = self.get_queryset().filter(is_active=True)
        serializer = self.get_serializer(active_trips, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_purpose(self, request):
        """Get trips filtered by purpose"""
        purpose = request.query_params.get('purpose')
        if purpose:
            trips = self.get_queryset().filter(purpose=purpose)
            serializer = self.get_serializer(trips, many=True)
            return Response(serializer.data)
        return Response({'error': 'Purpose parameter required'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def by_transport_mode(self, request):
        """Get trips filtered by transport mode"""
        mode = request.query_params.get('mode')
        if mode:
            trips = self.get_queryset().filter(transport_mode=mode)
            serializer = self.get_serializer(trips, many=True)
            return Response(serializer.data)
        return Response({'error': 'Mode parameter required'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def add_route_point(self, request, pk=None):
        """Add a route point to a trip"""
        trip = self.get_object()
        serializer = RoutePointSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(trip=trip)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def add_accompanying_traveler(self, request, pk=None):
        """Add an accompanying traveler to a trip"""
        trip = self.get_object()
        serializer = AccompanyingTravelerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(trip=trip)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class HouseholdViewSet(viewsets.ModelViewSet):
    queryset = Household.objects.all()
    serializer_class = HouseholdSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Household.objects.all().order_by('-created_at')
    
    @action(detail=False, methods=['get'])
    def incomplete_surveys(self, request):
        """Get households with incomplete surveys"""
        incomplete = self.get_queryset().filter(is_complete=False)
        serializer = self.get_serializer(incomplete, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def complete_survey(self, request, pk=None):
        """Mark a household survey as complete"""
        household = self.get_object()
        household.is_complete = True
        household.save()
        serializer = self.get_serializer(household)
        return Response(serializer.data)