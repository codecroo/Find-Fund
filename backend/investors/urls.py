from django.urls import path
from .views import BrowseStartups

urlpatterns = [
    path("browse/", BrowseStartups.as_view(), name="browse-startups"),
]
