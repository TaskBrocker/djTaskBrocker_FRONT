from django.urls import path
from .views import index

urlpatterns = [
    path('tb', index)
    ,path('tb/dashboard', index)
    ,path('tb/dashboard/monitor', index)
    ,path('tb/dashboard/tasklist', index)
    ,path('tb/dashboard/taskelement', index)
]