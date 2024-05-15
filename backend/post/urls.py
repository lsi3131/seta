from django.urls import path
from . import views

urlpatterns = [
    path("<int:post_pk>/comments/", views.PostCommentsAPIView.as_view(), name='comment'),
    path("<int:post_pk>/comments/<int:comment_pk>/", views.PostDetailAPIView.as_view(), name='comment_detail'),
]