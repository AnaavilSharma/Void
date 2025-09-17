from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count, Sum, Avg
from django.utils import timezone
from datetime import timedelta
from .models import TrafficAlert, RouteOptimization, CityAnalytics, PopularRoute
from trips.models import Trip
from users.models import Household


class AnalyticsViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def dashboard_stats(self, request):
        """Get dashboard statistics"""
        today = timezone.now().date()
        
        # Trip statistics
        total_trips = Trip.objects.count()
        today_trips = Trip.objects.filter(start_time__date=today).count()
        
        # Distance and duration
        total_distance = Trip.objects.aggregate(Sum('distance'))['distance__sum'] or 0
        total_duration = Trip.objects.aggregate(Sum('duration'))['duration__sum'] or 0
        
        # CO2 statistics
        total_co2_emission = Trip.objects.aggregate(Sum('co2_emission'))['co2_emission__sum'] or 0
        total_co2_saved = Trip.objects.aggregate(Sum('co2_saved'))['co2_saved__sum'] or 0
        
        # Data quality
        quality_stats = Trip.objects.values('data_quality').annotate(count=Count('id'))
        
        # Transport mode distribution
        mode_stats = Trip.objects.values('transport_mode').annotate(count=Count('id'))
        
        # Purpose distribution
        purpose_stats = Trip.objects.values('purpose').annotate(count=Count('id'))
        
        # Household statistics
        total_households = Household.objects.count()
        completed_surveys = Household.objects.filter(is_complete=True).count()
        
        return Response({
            'total_trips': total_trips,
            'today_trips': today_trips,
            'total_distance_km': round(total_distance / 1000, 2),
            'total_duration_hours': round(total_duration / 3600, 2),
            'total_co2_emission': round(total_co2_emission, 2),
            'total_co2_saved': round(total_co2_saved, 2),
            'data_quality': dict(quality_stats),
            'transport_modes': dict(mode_stats),
            'trip_purposes': dict(purpose_stats),
            'total_households': total_households,
            'completed_surveys': completed_surveys,
            'survey_completion_rate': round((completed_surveys / total_households * 100) if total_households > 0 else 0, 2),
        })
    
    @action(detail=False, methods=['get'])
    def trip_trends(self, request):
        """Get trip trends over time"""
        days = int(request.query_params.get('days', 7))
        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=days)
        
        trips = Trip.objects.filter(start_time__date__range=[start_date, end_date])
        
        # Group by date
        daily_stats = {}
        for trip in trips:
            date = trip.start_time.date()
            if date not in daily_stats:
                daily_stats[date] = {
                    'date': date.isoformat(),
                    'trips': 0,
                    'distance': 0,
                    'co2_emission': 0,
                }
            daily_stats[date]['trips'] += 1
            daily_stats[date]['distance'] += trip.distance
            daily_stats[date]['co2_emission'] += trip.co2_emission
        
        return Response(list(daily_stats.values()))
    
    @action(detail=False, methods=['get'])
    def popular_routes(self, request):
        """Get most popular routes"""
        limit = int(request.query_params.get('limit', 10))
        
        # This would need more complex logic to group similar routes
        # For now, return a simple implementation
        popular_routes = PopularRoute.objects.all()[:limit]
        
        return Response([
            {
                'origin': f"{route.origin_latitude}, {route.origin_longitude}",
                'destination': f"{route.destination_latitude}, {route.destination_longitude}",
                'frequency': route.frequency,
                'average_duration': route.average_duration,
                'transport_modes': route.transport_modes,
            }
            for route in popular_routes
        ])
    
    @action(detail=False, methods=['get'])
    def traffic_alerts(self, request):
        """Get current traffic alerts"""
        active_alerts = TrafficAlert.objects.filter(is_active=True).order_by('-timestamp')
        
        return Response([
            {
                'id': str(alert.id),
                'location': alert.location_name,
                'type': alert.alert_type,
                'severity': alert.severity,
                'description': alert.description,
                'estimated_delay': alert.estimated_delay,
                'timestamp': alert.timestamp,
            }
            for alert in active_alerts
        ])
    
    @action(detail=False, methods=['get'])
    def export_data(self, request):
        """Export data for NATPAC research"""
        format_type = request.query_params.get('format', 'json')
        
        if format_type == 'csv':
            # CSV export logic would be implemented here
            return Response({'message': 'CSV export not implemented yet'})
        
        # JSON export
        trips = Trip.objects.all()[:1000]  # Limit for demo
        households = Household.objects.all()
        
        return Response({
            'trips': [
                {
                    'trip_number': trip.trip_number,
                    'user': trip.user.username,
                    'start_time': trip.start_time,
                    'end_time': trip.end_time,
                    'purpose': trip.purpose,
                    'transport_mode': trip.transport_mode,
                    'distance': trip.distance,
                    'duration': trip.duration,
                    'co2_emission': trip.co2_emission,
                    'data_quality': trip.data_quality,
                    'consent_given': trip.consent_given,
                }
                for trip in trips
            ],
            'households': [
                {
                    'household_id': household.household_id,
                    'household_size': household.household_size,
                    'income_level': household.income_level,
                    'vehicle_ownership': household.vehicle_ownership,
                    'residence_type': household.residence_type,
                    'survey_date': household.survey_date,
                    'is_complete': household.is_complete,
                }
                for household in households
            ]
        })