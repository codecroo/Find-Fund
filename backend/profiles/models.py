from django.db import models
from django.contrib.auth.models import User


class FounderProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="founder_profile")
    bio = models.TextField(blank=True)
    linkedin = models.URLField(blank=True)
    experience = models.TextField(blank=True)

    def __str__(self):
        return f"FounderProfile: {self.user.username}"


class InvestorProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="investor_profile")
    bio = models.TextField(blank=True)
    linkedin = models.URLField(blank=True)
    investment_range_min = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    investment_range_max = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    industries_of_interest = models.CharField(max_length=255, blank=True)
    location = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"InvestorProfile: {self.user.username}"
