from django.db import models
from django.contrib.auth.models import User

class FounderProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="founder_profile")

    # Basic Info
    full_name = models.CharField(max_length=255, blank=True)
    email = models.EmailField(blank=True)   # public contact email
    phone = models.CharField(max_length=20, blank=True)  # optional
    location = models.CharField(max_length=255, blank=True)
    company = models.CharField(max_length=255, blank=True)

    # Professional Info
    bio = models.TextField(blank=True)
    experience = models.TextField(blank=True)
    skills = models.TextField(blank=True, help_text="Comma-separated skills")

    # Links
    linkedin = models.URLField(blank=True)
    twitter = models.URLField(blank=True)
    website = models.URLField(blank=True)

    def __str__(self):
        return f"FounderProfile: {self.user.username}"


class InvestorProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="investor_profile")

    # Basic Info
    full_name = models.CharField(max_length=255, blank=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    location = models.CharField(max_length=255, blank=True)

    # Professional Info
    bio = models.TextField(blank=True)
    linkedin = models.URLField(blank=True)
    twitter = models.URLField(blank=True)
    website = models.URLField(blank=True)

    # Investment Preferences
    investment_range_min = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    investment_range_max = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    industries_of_interest = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"InvestorProfile: {self.user.username}"
