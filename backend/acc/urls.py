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
    path('<str:email>/activate/',views.UserActivateAPIView.as_view()),
    path('<str:email>/findname/',views.FindNameAPIView.as_view()),
    path('<str:email>/<str:username>/findpassword/',views.FindPasswordAPIView.as_view()),

    path('vote/<str:username>/', views.AccountMbtiVoteView.as_view()),
]

urlpatterns += [
    path('social/profile/<str:username>/', views.social),
    path('social/login/', views.social_login),
    path('social/callback/', views.social_callback),
    path("kakao/callback/", views.kakao_callback, name="kakao_callback"),
]