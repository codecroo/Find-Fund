from django.db import models
from django.contrib.auth.models import User
class Startup(models.Model):
    founder = models.ForeignKey(
    User, on_delete=models.CASCADE, related_name="startups", null=True, blank=True
    )

    name = models.CharField(max_length=255)
    industry = models.CharField(max_length=255, blank=True)
    stage = models.CharField(max_length=50, blank=True)   # NEW
    funding_goal = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)  # NEW
    description = models.TextField(blank=True)
    website = models.URLField(blank=True)  # NEW
    team_size = models.PositiveIntegerField(null=True, blank=True)  # NEW
    location = models.CharField(max_length=255, blank=True)  # NEW
    pitch_deck = models.FileField(upload_to="pitch_decks/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
