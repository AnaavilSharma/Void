from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import User, Household, UserHousehold

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'phone', 'date_of_birth', 'gender', 'created_at']
        read_only_fields = ['id', 'created_at']


class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'phone', 'date_of_birth', 'gender']
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class HouseholdSerializer(serializers.ModelSerializer):
    class Meta:
        model = Household
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class UserHouseholdSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    household = HouseholdSerializer(read_only=True)
    
    class Meta:
        model = UserHousehold
        fields = '__all__'
