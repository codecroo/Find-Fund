from rest_framework import serializers
from .models import FounderProfile, InvestorProfile


class FounderProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = FounderProfile
        fields = "__all__"
        read_only_fields = ["user"]


class InvestorProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvestorProfile
        fields = "__all__"
        read_only_fields = ["user"]
