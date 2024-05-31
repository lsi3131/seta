from django.db import models
from config.settings import AUTH_USER_MODEL
from account.models import Mbti


# Create your models here.
class ChatRoomCategory(models.Model):
    name = models.CharField(max_length=100)


class ChatRoom(models.Model):
    name = models.ForeignKey(AUTH_USER_MODEL, on_delete=models.CASCADE)
    is_secret = models.BooleanField(default=False, null=False)
    password = models.CharField(max_length=128)
    max_members = models.IntegerField(default=4, null=False)
    members = models.ManyToManyField(AUTH_USER_MODEL, related_name='member_chat_rooms')
    restricted_mbtis = models.ManyToManyField(Mbti, related_name='restricted_mbtis_chat_rooms')
    host_user = models.ForeignKey(AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='host_user_chat_rooms')
    room_category = models.ForeignKey(ChatRoomCategory, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    blacklist_users = models.ManyToManyField(AUTH_USER_MODEL, related_name='blacklist_user_chat_rooms')


class ChatMessage(models.Model):
    sender = models.ForeignKey(AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sender_chat_messages')
    room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name='room_chat_messages')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)