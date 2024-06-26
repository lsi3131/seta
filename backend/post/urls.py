from django.urls import path
from . import views

urlpatterns = [
    path("mbti/<str:mbti>/", views.PostAPIView.as_view(), name="post"),
    path("hot/", views.HotPost, name='hot'),
    path("search/", views.SearchAPIView.as_view(), name="search"),
    path("create/", views.CreatePostAPIView.as_view()),
    path("category/", views.PostCategoryAPIView.as_view(), name='Category'),
    path("<int:post_pk>/", views.PostDetailAPIView.as_view(), name="post_detail"),
    path("<int:post_pk>/hits/", views.add_hit, name="add_hit"),
    path("<int:post_pk>/comments/", views.PostCommentsAPIView.as_view(), name='comment'),
    path("<int:post_pk>/comments/<int:comment_pk>/", views.PostCommentDetailAPIView.as_view(), name='comment_detail'),
    path("<int:post_pk>/likey/", views.LikeyPost , name='LikeyPost' ),
    path("<int:post_pk>/comments/<int:comment_pk>/recommend/", views.Recommend, name='Recommend'),
    path("image/", views.Image, name='image'),
    path("myposts/", views.MypostsAPIView.as_view(), name='myposts'),
]