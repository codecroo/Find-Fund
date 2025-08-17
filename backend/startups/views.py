from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Startup
from .serializers import StartupSerializer
from django.shortcuts import get_object_or_404
from rest_framework.parsers import MultiPartParser, FormParser


class StartupListCreate(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]  # <- add this


    def get(self, request):
        startups = Startup.objects.filter(founder=request.user)
        serializer = StartupSerializer(startups, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = StartupSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(founder=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class StartupDetail(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]  # <- add this

    def get_object(self, pk, user):
        return get_object_or_404(Startup, pk=pk, founder=user)

    def get(self, request, pk):
        startup = self.get_object(pk, request.user)
        serializer = StartupSerializer(startup)
        return Response(serializer.data)

    def put(self, request, pk):
        startup = self.get_object(pk, request.user)
        serializer = StartupSerializer(startup, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(founder=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        startup = self.get_object(pk, request.user)
        startup.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
