from rest_framework import viewsets
from .models import LocationLog
from .serializers import LocationLogSerializer

class LocationLogViewSet(viewsets.ModelViewSet):
    queryset = LocationLog.objects.all()
    serializer_class = LocationLogSerializer