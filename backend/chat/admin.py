from django.contrib import admin
from .models import ChatMessage, ChatRoom, ChatRoomCategory, ChatRoomMember
# Register your models here.
admin.site.register(ChatMessage)
admin.site.register(ChatRoom)
admin.site.register(ChatRoomCategory)
admin.site.register(ChatRoomMember)