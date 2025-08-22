from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from startups.models import Startup
from startups.serializers import StartupSerializer
from .models import InvestmentRequest, SavedStartup
from .serializers import InvestmentRequestSerializer, SavedStartupSerializer


# ✅ Browse startups
class BrowseStartups(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        startups = Startup.objects.all().order_by("-created_at")
        serializer = StartupSerializer(startups, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# Investor's own requests (list + create)
class InvestmentRequestListCreate(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        requests = InvestmentRequest.objects.filter(
            investor=request.user
        ).order_by("-created_at")
        serializer = InvestmentRequestSerializer(requests, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = InvestmentRequestSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(investor=request.user)  # 👈 sets investor automatically
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Founder: manage incoming requests (list + accept/reject)
class FounderInvestmentRequests(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        startups = Startup.objects.filter(founder=request.user)
        requests = InvestmentRequest.objects.filter(
            startup__in=startups
        ).order_by("-created_at")
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

        if req.status != "accepted" and status_choice == "accepted":
            startup = req.startup
            available = startup.funding_goal - startup.amount_raised

            if req.amount > available:
                return Response(
                    {"error": f"Cannot accept. Only {available} left to raise."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Update raised amount
            startup.amount_raised += req.amount
            startup.save()

        req.status = status_choice
        req.save()
        return Response(
            {"message": f"Request {status_choice} successfully."},
            status=status.HTTP_200_OK,
        )


# ✅ Investor: see their accepted investments ("My Investments")
class MyInvestments(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        accepted = InvestmentRequest.objects.filter(
            investor=request.user, status="accepted"
        ).order_by("-created_at")
        serializer = InvestmentRequestSerializer(accepted, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# ✅ Investor: Save + List saved startups
class SavedStartups(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        saved = SavedStartup.objects.filter(investor=request.user).order_by("-created_at")
        serializer = SavedStartupSerializer(saved, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        startup_id = request.data.get("startup")
        if not startup_id:
            return Response({"error": "startup field required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            startup = Startup.objects.get(id=startup_id)
        except Startup.DoesNotExist:
            return Response({"error": "Startup not found"}, status=status.HTTP_404_NOT_FOUND)

        saved, created = SavedStartup.objects.get_or_create(
            investor=request.user, startup=startup
        )
        if not created:
            return Response({"message": "Already saved"}, status=status.HTTP_200_OK)

        serializer = SavedStartupSerializer(saved)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def delete(self, request, *args, **kwargs):
        startup_id = request.data.get("startup")
        if not startup_id:
            return Response({"error": "Startup ID required"}, status=400)
        
        SavedStartup.objects.filter(investor=request.user, startup_id=startup_id).delete()
        return Response(status=204)

