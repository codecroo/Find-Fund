from django.urls import path
from .views import FounderProfileView, InvestorProfileView

urlpatterns = [
    path("founder-profiles/me/", FounderProfileView.as_view(), name="founder-profile"),
    path("investor-profiles/me/", InvestorProfileView.as_view(), name="investor-profile"),
]

