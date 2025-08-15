from django.db import models
from django.contrib.auth.models import User

class Startup(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='startups')
    name = models.CharField(max_length=255)
    description = models.TextField()
    industry = models.CharField(max_length=100)
    funding_goal = models.DecimalField(max_digits=12, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
