from rest_framework import serializers
from .models import Trip, AccompanyingTraveler, RoutePoint, TripMetadata
from users.models import User, Household


class AccompanyingTravelerSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccompanyingTraveler
        fields = '__all__'


class RoutePointSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoutePoint
        fields = '__all__'


class TripMetadataSerializer(serializers.ModelSerializer):
    class Meta:
        model = TripMetadata
        fields = '__all__'


class TripSerializer(serializers.ModelSerializer):
    accompanying_travelers = AccompanyingTravelerSerializer(many=True, read_only=True)
    route_points = RoutePointSerializer(many=True, read_only=True)
    metadata = TripMetadataSerializer(read_only=True)
    user = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = Trip
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class TripCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        fields = [
            'trip_number', 'start_time', 'end_time',
            'start_latitude', 'start_longitude',
            'end_latitude', 'end_longitude',
            'purpose', 'transport_mode', 'distance', 'duration',
            'co2_emission', 'co2_saved', 'consent_given',
            'data_quality', 'household', 'trip_chain'
        ]


class HouseholdSerializer(serializers.ModelSerializer):
    class Meta:
        model = Household
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
