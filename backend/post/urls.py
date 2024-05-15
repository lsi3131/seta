from django.urls import path
from . import views

urlpatterns = [
    path("<str:mbti>/", views.PostAPIView.as_view(), name="post"),
    path("<int:post_pk>/comments/", views.PostCommentsAPIView.as_view(), name='comment'),
    path("<int:post_pk>/comments/<int:comment_pk>/", views.PostCommentDetailAPIView.as_view(), name='comment_detail'),
]