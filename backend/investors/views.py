from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from startups.models import Startup
from startups.serializers import StartupSerializer

# Create your views here.

class BrowseStartups(APIView):
    permission_classes = [permissions.IsAuthenticated]
        
    def get(self, request):
        startups = Startup.objects.all().order_by("-created_at")
        serializer = StartupSerializer(startups, many=True)
        return Response(serializer.data)