from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Startup
from .serializers import StartupSerializer

class StartupListCreate(APIView):
    permission_classes = [permissions.IsAuthenticated]

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
