from django.urls import path
from .views import BrowseStartups, InvestmentRequestListCreate,FounderInvestmentRequests

urlpatterns = [
    path("browse/", BrowseStartups.as_view(), name="browse-startups"),
    path("requests/", InvestmentRequestListCreate.as_view(), name="investment-request-list-create"),
    path("founder/requests/", FounderInvestmentRequests.as_view(), name="founder-investment-requests"),
    path("founder/requests/<int:pk>/", FounderInvestmentRequests.as_view(), name="founder-investment-request-update"),
]
