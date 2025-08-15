# accounts/urls
from django.urls import path
from accounts.views import signin,signup,signout,check_auth

urlpatterns = [
    path("signin/",signin),
    path('signup/',signup),
    path('signout/',signout),
    path('check-auth/',check_auth)
]
