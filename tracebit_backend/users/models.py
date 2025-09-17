from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


class User(AbstractUser):
    """Custom user model for NATPAC Trace-Bit app"""
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(
        max_length=20,
        choices=[
            ('male', 'Male'),
            ('female', 'Female'),
            ('other', 'Other'),
            ('prefer_not_to_say', 'Prefer not to say'),
        ],
        blank=True
    )
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.username


class Household(models.Model):
    """Household information for NATPAC surveys"""
    household_id = models.CharField(max_length=50, unique=True)
    household_size = models.PositiveIntegerField()
    income_level = models.CharField(
        max_length=20,
        choices=[
            ('below_25000', 'Below ₹25,000'),
            ('25000-50000', '₹25,000 - ₹50,000'),
            ('50000-100000', '₹50,000 - ₹1,00,000'),
            ('100000-200000', '₹1,00,000 - ₹2,00,000'),
            ('above_200000', 'Above ₹2,00,000'),
        ]
    )
    vehicle_ownership = models.CharField(
        max_length=20,
        choices=[
            ('no_vehicle', 'No Vehicle'),
            ('bicycle_only', 'Bicycle Only'),
            ('motorcycle_only', 'Motorcycle Only'),
            ('car_only', 'Car Only'),
            ('multiple_vehicles', 'Multiple Vehicles'),
        ]
    )
    residence_type = models.CharField(
        max_length=20,
        choices=[
            ('apartment', 'Apartment'),
            ('house', 'House'),
            ('villa', 'Villa'),
            ('shared_accommodation', 'Shared Accommodation'),
            ('other', 'Other'),
        ]
    )
    survey_date = models.DateTimeField(default=timezone.now)
    surveyor_id = models.CharField(max_length=50)
    is_complete = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Household {self.household_id}"


class UserHousehold(models.Model):
    """Link users to households"""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    household = models.ForeignKey(Household, on_delete=models.CASCADE)
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        unique_together = ['user', 'household']
    
    def __str__(self):
        return f"{self.user.username} - {self.household.household_id}"