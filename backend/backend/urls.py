from django.contrib import admin
from django.urls import path
from accounts import views as account_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/signup/', account_views.signup),
    path('api/signin/', account_views.signin),
    path('api/signout/', account_views.signout),
    path('api/check-auth/', account_views.check_auth),
]