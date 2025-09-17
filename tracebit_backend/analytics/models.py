from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()


class TrafficAlert(models.Model):
    """Real-time traffic alerts and congestion data"""
    ALERT_TYPES = [
        ('congestion', 'Congestion'),
        ('accident', 'Accident'),
        ('construction', 'Construction'),
        ('weather', 'Weather'),
        ('event', 'Event'),
    ]
    
    SEVERITY_LEVELS = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    
    id = models.UUIDField(primary_key=True, default=models.UUIDField().default, editable=False)
    location_name = models.CharField(max_length=200)
    latitude = models.DecimalField(max_digits=10, decimal_places=7)
    longitude = models.DecimalField(max_digits=10, decimal_places=7)
    alert_type = models.CharField(max_length=20, choices=ALERT_TYPES)
    severity = models.CharField(max_length=10, choices=SEVERITY_LEVELS)
    description = models.TextField()
    estimated_delay = models.IntegerField(help_text="Estimated delay in minutes")
    timestamp = models.DateTimeField(default=timezone.now)
    expires_at = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"{self.alert_type.title()} - {self.location_name}"


class RouteOptimization(models.Model):
    """Route optimization results using Dijkstra algorithm"""
    id = models.UUIDField(primary_key=True, default=models.UUIDField().default, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    
    # Route endpoints
    origin_latitude = models.DecimalField(max_digits=10, decimal_places=7)
    origin_longitude = models.DecimalField(max_digits=10, decimal_places=7)
    destination_latitude = models.DecimalField(max_digits=10, decimal_places=7)
    destination_longitude = models.DecimalField(max_digits=10, decimal_places=7)
    
    # Optimization constraints
    max_time = models.IntegerField(help_text="Maximum time in seconds")
    min_safety_score = models.FloatField(help_text="Minimum safety score 0-100")
    max_distance = models.FloatField(help_text="Maximum distance in meters")
    preferred_modes = models.JSONField(default=list, help_text="Preferred transport modes")
    avoid_congestion = models.BooleanField(default=True)
    eco_friendly = models.BooleanField(default=True)
    max_co2_emission = models.FloatField(help_text="Maximum CO2 emission in kg")
    
    # Results
    optimal_route = models.JSONField(help_text="Optimal route data")
    alternative_routes = models.JSONField(default=list, help_text="Alternative routes")
    total_time = models.IntegerField(help_text="Total time in seconds")
    total_distance = models.FloatField(help_text="Total distance in meters")
    total_co2_emission = models.FloatField(help_text="Total CO2 emission in kg")
    average_safety_score = models.FloatField(help_text="Average safety score")
    average_congestion_level = models.FloatField(help_text="Average congestion level")
    
    created_at = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return f"Route Optimization {self.id}"


class CityAnalytics(models.Model):
    """City-wide analytics and insights for NATPAC"""
    date = models.DateField(unique=True)
    
    # Trip statistics
    total_trips = models.PositiveIntegerField(default=0)
    total_distance = models.FloatField(default=0.0, help_text="Total distance in meters")
    total_duration = models.BigIntegerField(default=0, help_text="Total duration in seconds")
    
    # Environmental impact
    total_co2_emission = models.FloatField(default=0.0, help_text="Total CO2 emission in kg")
    total_co2_saved = models.FloatField(default=0.0, help_text="Total CO2 saved in kg")
    average_eco_score = models.FloatField(default=0.0, help_text="Average eco score")
    
    # Transport mode distribution
    walking_trips = models.PositiveIntegerField(default=0)
    cycling_trips = models.PositiveIntegerField(default=0)
    public_transport_trips = models.PositiveIntegerField(default=0)
    private_vehicle_trips = models.PositiveIntegerField(default=0)
    
    # Purpose distribution
    work_trips = models.PositiveIntegerField(default=0)
    education_trips = models.PositiveIntegerField(default=0)
    shopping_trips = models.PositiveIntegerField(default=0)
    recreation_trips = models.PositiveIntegerField(default=0)
    medical_trips = models.PositiveIntegerField(default=0)
    social_trips = models.PositiveIntegerField(default=0)
    other_trips = models.PositiveIntegerField(default=0)
    
    # Data quality
    excellent_data_count = models.PositiveIntegerField(default=0)
    good_data_count = models.PositiveIntegerField(default=0)
    fair_data_count = models.PositiveIntegerField(default=0)
    poor_data_count = models.PositiveIntegerField(default=0)
    
    # Household data
    households_surveyed = models.PositiveIntegerField(default=0)
    households_completed = models.PositiveIntegerField(default=0)
    
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-date']
    
    def __str__(self):
        return f"City Analytics - {self.date}"
    
    @property
    def data_quality_percentage(self):
        total = self.excellent_data_count + self.good_data_count + self.fair_data_count + self.poor_data_count
        if total == 0:
            return 0
        return ((self.excellent_data_count + self.good_data_count) / total) * 100


class PopularRoute(models.Model):
    """Most popular routes in the city"""
    origin_latitude = models.DecimalField(max_digits=10, decimal_places=7)
    origin_longitude = models.DecimalField(max_digits=10, decimal_places=7)
    destination_latitude = models.DecimalField(max_digits=10, decimal_places=7)
    destination_longitude = models.DecimalField(max_digits=10, decimal_places=7)
    
    frequency = models.PositiveIntegerField(help_text="Number of times this route was taken")
    average_duration = models.FloatField(help_text="Average duration in seconds")
    transport_modes = models.JSONField(default=list, help_text="Most common transport modes")
    
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-frequency']
    
    def __str__(self):
        return f"Popular Route - {self.frequency} trips"