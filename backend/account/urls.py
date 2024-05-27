from django.urls import path
from . import views

urlpatterns = [
    path('', views.AccountAPIView.as_view()),
    path('<str:username>/', views.ProfileAPIView.as_view()),
    path('<str:username>/ranking/', views.mbtiRank),
    path('mbti/<str:mbti_type>/', views.MbtiDetailAPIView.as_view()),
    path('set/mbti/', views.MbtiAPIView.as_view()),
    path('set/password/', views.AccountPasswordAPIView.as_view()),
    path('validate/password/', views.validate_password),
    path('validate/username/', views.validate_username),
    path('validate/email/', views.validate_email),
    path('<str:username>/follow/', views.follow),
    path('<str:username>/check_follow/', views.check_follow),
    path('<str:username>/myposts/',views.Myposts),
    path('<str:email>/activate/',views.UserActivateAPIView.as_view())
]
