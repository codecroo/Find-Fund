from django.contrib import admin
from .models import FounderProfile,InvestorProfile

# Register your models here.
admin.site.register(FounderProfile)
admin.site.register(InvestorProfile)