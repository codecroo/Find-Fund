# backend/urls
from django.contrib import admin
from django.urls import path,include
from accounts import views as account_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/',include('accounts.urls')),
]