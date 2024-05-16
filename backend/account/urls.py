from django.urls import path
from . import views

urlpatterns = [
    path('', views.AccountAPIView.as_view()),
    path('validate/password/', views.validate_password),
    path('validate/username/', views.validate_username),
    path('validate/email/', views.validate_email),
    path('<str:username>/', views.ProfileAPIView.as_view()),
    path('<str:username>/follow/', views.follow)
]
