# investors/serializers.py
from rest_framework import serializers
from .models import InvestmentRequest
from startups.models import Startup
from startups.serializers import StartupSerializer
from profiles.serializers import InvestorProfileSerializer
from decimal import Decimal


class InvestmentRequestSerializer(serializers.ModelSerializer):
    startup = StartupSerializer(read_only=True)
    investor = InvestorProfileSerializer(source='investor.investor_profile', read_only=True)

    startup_id = serializers.PrimaryKeyRelatedField(
        queryset=Startup.objects.all(),
        source="startup",
        write_only=True
    )

    class Meta:
        model = InvestmentRequest
        fields = [
            "id",
            "startup",      # nested (read-only)
            "startup_id",   # write-only
            "investor",
            "amount",
            "status",
            "created_at",
        ]
        read_only_fields = ["investor", "status", "created_at"]

    def validate(self, data):
        startup = data["startup"]
        amount = Decimal(data["amount"])

        available = startup.funding_goal - startup.amount_raised
        if amount > available:
            raise serializers.ValidationError(
                {"amount": f"This startup only has {available} left to raise."}
            )
        if amount <= 0:
            raise serializers.ValidationError(
                {"amount": "Amount must be greater than 0."}
            )
        return data
