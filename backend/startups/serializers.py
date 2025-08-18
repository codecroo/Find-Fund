from rest_framework import serializers
from .models import Startup
from profiles.serializers import FounderProfileSerializer

class StartupSerializer(serializers.ModelSerializer):
    founder=FounderProfileSerializer(source="founder.founder_profile")
    
    class Meta:
        model = Startup
        fields = "__all__"
        read_only_fields = ["founder", "valuation", "created_at"]