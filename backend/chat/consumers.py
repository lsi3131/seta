from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
import json
from .models import *
from django.contrib.auth import get_user_model

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data['type']
        message = data['message']
        username = data['username']

        if message_type == 'message':
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message,
                    'username': username,
                }
            )
        elif message_type == 'enter':
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': f'{username}님이 입장하셨습니다.',
                    'username': username,
                }
            )
            await self.enter_room(self.room_name, username)
        
        elif message_type == 'leave':
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': f'{username}님이 퇴장하셨습니다.',
                    'username': username,
                }
            )
            await self.leave_room(self.room_name, username)
            
    async def chat_message(self, event):
        message = event['message']
        username = event['username']

        await self.send(text_data=json.dumps({
            'message': message,
            'username': username
        }))
    
    @database_sync_to_async
    def save_message(self, room, sender, message_text):
        # 메시지 텍스트가 제공되었는지 확인합니다.
        if not sender or not message_text:
            raise ValueError("발신자 및 메시지 텍스트가 필요합니다.")
        
        # 메시지를 생성하고 데이터베이스에 저장합니다.
        # timestamp 필드는 auto_now_add=True 속성 때문에 자동으로 현재 시간이 저장됩니다.
        ChatMessage.objects.create(room=room, sender = sender, content=message_text)

    @database_sync_to_async
    def enter_room(self, roomid, username):
        user = User.objects.get(username=username)
        room = ChatRoom.objects.get(id=int(roomid))
        room.members.add(user)
        return room
    
    @database_sync_to_async
    def leave_room(self, roomid, username):
        user = User.objects.get(username=username)
        room = ChatRoom.objects.get(id=int(roomid))
        room.members.remove(user)
        if room.members.count() == 0:
            room.delete()
        return room