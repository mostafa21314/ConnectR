from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create_job, name='create_job'),
    path('', views.list_jobs, name='list_jobs'),
    path('<int:job_id>/', views.get_job_details, name='get_job_details'),
] 