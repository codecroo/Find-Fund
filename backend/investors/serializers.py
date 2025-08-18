from rest_framework import serializers
from .models import InvestmentRequest
from startups.serializers import StartupSerializer
from profiles.serializers import InvestorProfileSerializer

class InvestmentRequestSerializer(serializers.ModelSerializer):
    startup = StartupSerializer(read_only=True)  # for GET
    investor = InvestorProfileSerializer(source='investor.investor_profile',read_only=True)
 
    class Meta:
        model = InvestmentRequest
        fields = "__all__"
        read_only_fields = ["investor","status", "created_at"]