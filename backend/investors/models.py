from django.db import models
from django.contrib.auth.models import User
from startups.models import Startup  # adjust if your Startup model is elsewhere

class InvestmentRequest(models.Model):
    investor = models.ForeignKey(User, on_delete=models.CASCADE, related_name="investment_requests")
    startup = models.ForeignKey(Startup, on_delete=models.CASCADE, related_name="requests")
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
    max_length=20,
    choices=[("pending", "Pending"), ("accepted", "Accepted"), ("rejected", "Rejected")],
    default="pending"
    )


    def __str__(self):
        return f"{self.investor} → {self.startup} ({self.amount})"