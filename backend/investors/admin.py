from django.contrib import admin
# Register your models here.
from .models import InvestmentRequest,SavedStartup

admin.site.register(InvestmentRequest)
admin.site.register(SavedStartup)