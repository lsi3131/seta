from django.urls import path
from . import views

urlpatterns = [
    path('', views.MessageAPIView.as_view()),
    path('<int:message_id>/', views.MessageDetailAPIView.as_view()),
]