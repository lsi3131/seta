from django.urls import path
from . import views

urlpatterns = [
    path("", views.ChatRoomAPIView.as_view(), name="chat_room"),
    path("<int:chatroom_pk>/", views.ChatRoomDetailAPIView.as_view(), name='chat_room_pk'),
    path("<int:chatroom_pk>/message/", views.ChatMessageAPIView.as_view(), name='chat_message'),
    path("category/", views.get_category),
    path("check_room_password/", views.check_room_password),
]