from django.urls import path
from . import views

urlpatterns = [
    path("<int:post_pk>/comments/", views.PostCommentsAPIView.as_view(), name='comment'),
    path("<int:post_pk>/comments/<int:comment_pk>/", views.PostCommentDetailAPIView.as_view(), name='comment_detail'),
    path("api/posts/<int:post_pk>/likey/",views.likeyPostAPIvew.as_view(), name='PostLikey' )
]