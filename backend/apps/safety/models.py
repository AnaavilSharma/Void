from django.db import models

class LocationLog(models.Model):
    latitude = models.FloatField()
    longitude = models.FloatField()
    num_people = models.PositiveIntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Location ({self.latitude}, {self.longitude}) at {self.timestamp}"