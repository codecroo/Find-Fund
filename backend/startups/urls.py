from django.urls import path
from .views import StartupListCreate,StartupDetail

urlpatterns = [
    path("", StartupListCreate.as_view(), name="startup-list-create"),
    path("<int:pk>/", StartupDetail.as_view(), name="startup-detail"),
]
