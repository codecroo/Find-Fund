from rest_framework import serializers
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    role = serializers.CharField(source="profile.role", read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']