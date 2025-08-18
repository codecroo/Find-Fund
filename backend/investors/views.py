from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from startups.models import Startup
from startups.serializers import StartupSerializer
from .models import InvestmentRequest
from .serializers import InvestmentRequestSerializer


# ✅ Browse startups
class BrowseStartups(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        startups = Startup.objects.all().order_by("-created_at")
        serializer = StartupSerializer(startups, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# ✅ Handle Investment Requests
class InvestmentRequestListCreate(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # show only requests of the logged-in investor
        requests = InvestmentRequest.objects.filter(investor=request.user).order_by("-created_at")
        serializer = InvestmentRequestSerializer(requests, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = InvestmentRequestSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(investor=request.user)  # set investor automatically
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class FounderInvestmentRequests(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Get all startups owned by this founder
        startups = Startup.objects.filter(founder=request.user)
        requests = InvestmentRequest.objects.filter(startup__in=startups).order_by("-created_at")
        serializer = InvestmentRequestSerializer(requests, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, pk):
        try:
            req = InvestmentRequest.objects.get(pk=pk, startup__founder=request.user)
        except InvestmentRequest.DoesNotExist:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        status_choice = request.data.get("status")
        if status_choice not in ["accepted", "rejected"]:
            return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)

        req.status = status_choice
        req.save()
        return Response({"message": f"Request {status_choice}"}, status=status.HTTP_200_OK)
