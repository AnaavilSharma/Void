from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
import uuid

User = get_user_model()


class Trip(models.Model):
    """Trip data collection for NATPAC research"""
    TRIP_PURPOSES = [
        ('work', 'Work'),
        ('education', 'Education'),
        ('shopping', 'Shopping'),
        ('recreation', 'Recreation'),
        ('medical', 'Medical'),
        ('social', 'Social'),
        ('other', 'Other'),
    ]
    
    TRANSPORT_MODES = [
        ('walking', 'Walking'),
        ('cycling', 'Cycling'),
        ('public_transport', 'Public Transport'),
        ('car', 'Car'),
        ('motorcycle', 'Motorcycle'),
        ('scooter', 'Scooter'),
        ('unknown', 'Unknown'),
    ]
    
    DATA_QUALITY_CHOICES = [
        ('excellent', 'Excellent'),
        ('good', 'Good'),
        ('fair', 'Fair'),
        ('poor', 'Poor'),
    ]
    
    # Basic trip information
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    trip_number = models.CharField(max_length=20, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='trips')
    
    # Trip timing
    start_time = models.DateTimeField()
    end_time = models.DateTimeField(null=True, blank=True)
    
    # Locations
    start_latitude = models.DecimalField(max_digits=10, decimal_places=7)
    start_longitude = models.DecimalField(max_digits=10, decimal_places=7)
    end_latitude = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    end_longitude = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    
    # Trip details
    purpose = models.CharField(max_length=20, choices=TRIP_PURPOSES)
    transport_mode = models.CharField(max_length=20, choices=TRANSPORT_MODES)
    distance = models.FloatField(help_text="Distance in meters")  # in meters
    duration = models.IntegerField(help_text="Duration in seconds")  # in seconds
    
    # Environmental impact
    co2_emission = models.FloatField(default=0.0, help_text="CO2 emission in kg")
    co2_saved = models.FloatField(default=0.0, help_text="CO2 saved in kg")
    
    # NATPAC specific fields
    consent_given = models.BooleanField(default=False)
    data_quality = models.CharField(max_length=10, choices=DATA_QUALITY_CHOICES, default='good')
    household = models.ForeignKey('users.Household', on_delete=models.SET_NULL, null=True, blank=True)
    
    # Trip chain
    trip_chain = models.JSONField(default=list, help_text="Related trip IDs")
    
    # Metadata
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-start_time']
    
    def __str__(self):
        return f"Trip {self.trip_number} - {self.user.username}"
    
    @property
    def duration_minutes(self):
        return self.duration / 60 if self.duration else 0
    
    @property
    def distance_km(self):
        return self.distance / 1000 if self.distance else 0


class AccompanyingTraveler(models.Model):
    """Accompanying travelers for trips"""
    RELATIONSHIP_CHOICES = [
        ('spouse', 'Spouse'),
        ('child', 'Child'),
        ('parent', 'Parent'),
        ('sibling', 'Sibling'),
        ('friend', 'Friend'),
        ('colleague', 'Colleague'),
        ('other', 'Other'),
    ]
    
    AGE_GROUP_CHOICES = [
        ('0-5', '0-5 years'),
        ('6-12', '6-12 years'),
        ('13-17', '13-17 years'),
        ('18-24', '18-24 years'),
        ('25-34', '25-34 years'),
        ('35-44', '35-44 years'),
        ('45-54', '45-54 years'),
        ('55-64', '55-64 years'),
        ('65+', '65+ years'),
    ]
    
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
        ('prefer_not_to_say', 'Prefer not to say'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='accompanying_travelers')
    relationship = models.CharField(max_length=20, choices=RELATIONSHIP_CHOICES)
    age_group = models.CharField(max_length=10, choices=AGE_GROUP_CHOICES)
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES)
    is_primary_traveler = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return f"{self.relationship} - {self.trip.trip_number}"


class RoutePoint(models.Model):
    """GPS points along the trip route"""
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='route_points')
    latitude = models.DecimalField(max_digits=10, decimal_places=7)
    longitude = models.DecimalField(max_digits=10, decimal_places=7)
    accuracy = models.FloatField(null=True, blank=True, help_text="GPS accuracy in meters")
    altitude = models.FloatField(null=True, blank=True, help_text="Altitude in meters")
    speed = models.FloatField(null=True, blank=True, help_text="Speed in m/s")
    heading = models.FloatField(null=True, blank=True, help_text="Heading in degrees")
    timestamp = models.DateTimeField()
    transport_mode = models.CharField(max_length=20, choices=Trip.TRANSPORT_MODES, null=True, blank=True)
    
    class Meta:
        ordering = ['timestamp']
    
    def __str__(self):
        return f"Point {self.id} - {self.trip.trip_number}"


class TripMetadata(models.Model):
    """Additional metadata for trips"""
    trip = models.OneToOneField(Trip, on_delete=models.CASCADE, related_name='metadata')
    
    # Weather data
    temperature = models.FloatField(null=True, blank=True, help_text="Temperature in Celsius")
    humidity = models.FloatField(null=True, blank=True, help_text="Humidity percentage")
    wind_speed = models.FloatField(null=True, blank=True, help_text="Wind speed in m/s")
    weather_conditions = models.CharField(max_length=100, blank=True)
    
    # Device information
    device_model = models.CharField(max_length=100, blank=True)
    device_os = models.CharField(max_length=50, blank=True)
    device_version = models.CharField(max_length=50, blank=True)
    battery_level = models.FloatField(null=True, blank=True, help_text="Battery level percentage")
    
    # Sensor data
    accelerometer_x = models.FloatField(null=True, blank=True)
    accelerometer_y = models.FloatField(null=True, blank=True)
    accelerometer_z = models.FloatField(null=True, blank=True)
    gyroscope_x = models.FloatField(null=True, blank=True)
    gyroscope_y = models.FloatField(null=True, blank=True)
    gyroscope_z = models.FloatField(null=True, blank=True)
    magnetometer_x = models.FloatField(null=True, blank=True)
    magnetometer_y = models.FloatField(null=True, blank=True)
    magnetometer_z = models.FloatField(null=True, blank=True)
    
    # Traffic data
    traffic_level = models.FloatField(null=True, blank=True, help_text="Traffic level 0-100")
    
    created_at = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return f"Metadata for {self.trip.trip_number}"