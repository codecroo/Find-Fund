from django.contrib import admin
# Register your models here.
from .models import InvestmentRequest

admin.site.register(InvestmentRequest)