from django.urls import path
from .views import index

urlpatterns = [
    path('', index),
    path('monitor', index),
    path('tasklist', index),
    path('taskelement', index),
]