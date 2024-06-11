from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
import json
from .models import *
from django.contrib.auth import get_user_model
from collections import defaultdict

User = get_user_model()
room_messages = defaultdict(list)

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
        await self.save_messages(self.room_name)
        await self.delete_room(self.room_name)
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )


    async def receive(self, text_data):
        data = json.loads(text_data)

        message_type = data.get('message_type')
        message = data['message']
        username = data['username']

        if message_type == 'message':
            room_messages[self.room_name].append({'username':username, 'message':message})
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message,
                    'username': username,
                    'message_type':message_type,
                }
            )
            if len(room_messages[self.room_name]) >= 10:
                await self.save_messages(self.room_name)

        elif message_type == 'enter':
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': f'{username}님이 입장하셨습니다.',
                    'username': username,
                    'message_type':message_type,

                }
            )
        
        elif message_type == 'leave':
            await self.save_messages(self.room_name)
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': f'{username}님이 퇴장하셨습니다.',
                    'username': username,
                    'message_type':message_type,
                }
            )
            await self.leave_room(self.room_name, username)
        
        elif message_type == 'host_change':
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': f'{username}님께 방장이 위임됩니다.',
                    'username': username,
                    'message_type':message_type,
                }
            )
            
        elif message_type == 'expel':
            await self.save_messages(self.room_name)
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': f'{username}님이 추방되었습니다.',
                    'username': username,
                    'message_type':message_type,
                }
            )
            
    async def chat_message(self, event):
        message = event['message']
        username = event['username']
        message_type = event['message_type']

        if message_type == 'leave':
            if not username in self.members:
                return 

        if message_type == 'enter':
            self.members = await self.enter_room(self.room_name, username)
        elif message_type == 'leave':
            self.members = await self.leave_room(self.room_name, username)
        elif message_type == 'host_change':
            self.members = await self.get_room_members(self.room_name)
        elif message_type == 'expel':
            self.members = await self.expel_user(self.room_name, username)

        await self.send(text_data=json.dumps({
            'message': message,
            'username': username,
            'message_type':message_type,
            'members': self.members
        }))
    
    @database_sync_to_async
    def save_messages(self, room_name):
        room = ChatRoom.objects.get(id=int(room_name))
        messages = room_messages[room_name]
        for msg in messages:
            user = User.objects.get(username=msg['username'])
            ChatMessage.objects.create(room=room, sender=user, content=msg['message']).save()

        room_messages[room_name] = []
    

    @database_sync_to_async
    def enter_room(self, roomid, username):
        user = User.objects.get(username=username)
        room = ChatRoom.objects.get(id=int(roomid))
        room.members.add(user)
        room.save()
        return list(room.members.values_list('username', flat=True))
    
    @database_sync_to_async
    def leave_room(self, roomid, username):
        try:
            user = User.objects.get(username=username)
            room = ChatRoom.objects.get(id=int(roomid))

            room.members.remove(user)

            if room.members.count() > 0:
                if user == room.host_user:
                    room.host_user = room.members.first()
                    room.save()
                return list(room.members.values_list('username', flat=True))
            else:
                room.delete()
                room_messages.pop(roomid)
                return []
        except:
            return []
        
    
    @database_sync_to_async
    def get_room_members(self, roomid):
        room = ChatRoom.objects.get(id=int(roomid))
        return list(room.members.values_list('username', flat=True))
    
    @database_sync_to_async
    def expel_user(self, roomid, username):
        user = User.objects.get(username=username)
        room = ChatRoom.objects.get(id=int(roomid))
        room.members.remove(user)
        room.blacklist_users.add(user)
        return list(room.members.values_list('username', flat=True))

    
    @database_sync_to_async
    def delete_room(self, roomid):
        room = ChatRoom.objects.get(id=int(roomid))
        if room.members.count() > 0:
            return False
        room.delete()
        room_messages.pop(roomid)
        return True