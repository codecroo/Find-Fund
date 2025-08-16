from django.urls import path
from .views import StartupListCreate

urlpatterns = [
    path("", StartupListCreate.as_view(), name="startup-list-create"),
]
