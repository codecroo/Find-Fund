from django.db import models
from django.contrib.auth.models import User

class Startup(models.Model):
    founder = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="startups", null=True, blank=True
    )

    name = models.CharField(max_length=255)
    industry = models.CharField(max_length=255, blank=True)
    stage = models.CharField(max_length=50, blank=True)
    funding_goal = models.DecimalField(max_digits=12, decimal_places=2)
    equity = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)  # % of equity offered
    valuation = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)  # auto-calculated

    description = models.TextField(blank=True)
    website = models.URLField(blank=True)
    team_size = models.PositiveIntegerField(null=True, blank=True)
    location = models.CharField(max_length=255, blank=True)
    pitch_deck = models.FileField(upload_to="pitch_decks/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Calculate valuation if funding_goal and equity are set
        if self.funding_goal and self.equity and self.equity > 0:
            self.valuation = (self.funding_goal / (self.equity / 100))
        else:
            self.valuation = None
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
