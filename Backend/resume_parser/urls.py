from django.urls import path
from . import views

urlpatterns = [
    path('api/upload-resume', views.upload_resume, name='upload_resume'),
    path('api/parse-resume', views.parse_resume, name='parse_resume'),
]
