from django.urls import path
from . import views

urlpatterns = [
    path('validate/password/', views.validate_password),
    path('validate/username/', views.validate_username),
    path('validate/email/', views.validate_email),
]