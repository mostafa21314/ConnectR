from django.contrib import admin
from .models import Job

@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ('title', 'company', 'location', 'created_at')
    list_filter = ('company', 'location', 'created_at')
    search_fields = ('title', 'company', 'description')
    ordering = ('-created_at',)
