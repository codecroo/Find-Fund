from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404
from .models import FounderProfile, InvestorProfile
from .serializers import FounderProfileSerializer, InvestorProfileSerializer


class FounderProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile, created = FounderProfile.objects.get_or_create(user=request.user)
        serializer = FounderProfileSerializer(profile)
        return Response(serializer.data)

    def put(self, request):
        profile, created = FounderProfile.objects.get_or_create(user=request.user)
        serializer = FounderProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class InvestorProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile, created = InvestorProfile.objects.get_or_create(user=request.user)
        serializer = InvestorProfileSerializer(profile)
        return Response(serializer.data)

    def put(self, request):
        profile, created = InvestorProfile.objects.get_or_create(user=request.user)
        serializer = InvestorProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
