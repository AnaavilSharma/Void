from django.db import models

class Trip(models.Model):
    trip_number = models.CharField(max_length=50, unique=True)
    origin = models.CharField(max_length=255)
    destination = models.CharField(max_length=255)
    travel_time = models.DateTimeField()
    mode_of_transport = models.CharField(max_length=50)
    num_travelers = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.trip_number}: {self.origin} → {self.destination}"