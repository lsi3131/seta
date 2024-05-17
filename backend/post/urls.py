from django.urls import path
from . import views

urlpatterns = [
    path("mbti/<str:mbti>/", views.PostAPIView.as_view(), name="post"),
    path("create/", views.CreatePostAPIView.as_view()),
    path("<int:post_pk>/", views.PostDetailAPIView.as_view(), name="post_detail"),
    path("<int:post_pk>/comments/", views.PostCommentsAPIView.as_view(), name='comment'),
    path("<int:post_pk>/comments/<int:comment_pk>/", views.PostCommentDetailAPIView.as_view(), name='comment_detail'),
    path("<int:post_pk>/likey/", views.LikeyPost , name='LikeyPost' ),
    path("<int:post_pk>/comments/<int:comment_pk>/recommand/", views.Recommend, name='Recommend')
]