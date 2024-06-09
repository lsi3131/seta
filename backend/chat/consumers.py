from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
import json

from .bot import AIChatBot
from .models import *
from django.contrib.auth import get_user_model
from collections import defaultdict

User = get_user_model()
room_messages = defaultdict(list)
ai_chat_bot = AIChatBot()


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
        print(room_messages)
        data = json.loads(text_data)

        message_type = data.get('message_type')
        message = data['message']
        username = data['username']

        if message_type == 'message':
            room_messages[self.room_name].append({'username': username, 'message': message})
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message,
                    'username': username,
                    'message_type': message_type,
                }
            )
            if len(room_messages[self.room_name]) >= 10:
                await self.save_messages(self.room_name)

        if message_type == 'ai_message':
            # 사용자 채팅 메시지 응답
            room_messages[self.room_name].append({'username': username, 'message': message})
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message,
                    'username': username,
                    'message_type': 'message',
                }
            )

            if len(room_messages[self.room_name]) >= 10:
                await self.save_messages(self.room_name)

            # AI 메시지 응답
            ai_chatbot_message = await ai_chat_bot.response(message)
            print(ai_chatbot_message)
            room_messages[self.room_name].append({'username': username, 'message': ai_chatbot_message})
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': ai_chatbot_message,
                    'username': '봇',
                    'message_type': 'ai_message',
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
                    'message_type': message_type,

                }
            )
            await self.enter_room(self.room_name, username)

        elif message_type == 'leave':

            await self.save_messages(self.room_name)
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': f'{username}님이 퇴장하셨습니다.',
                    'username': username,
                    'message_type': message_type,
                }
            )
            await self.leave_room(self.room_name, username)

    async def chat_message(self, event):
        message = event['message']
        username = event['username']
        message_type = event['message_type']

        if message_type in ['enter', 'leave']:
            self.members = await self.get_room_members(self.room_name)

        await self.send(text_data=json.dumps({
            'message': message,
            'username': username,
            'message_type': message_type,
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
        return room

    @database_sync_to_async
    def leave_room(self, roomid, username):
        user = User.objects.get(username=username)
        room = ChatRoom.objects.get(id=int(roomid))
        room.members.remove(user)
        room.save()
        if room.members.count() == 0:
            room.delete()
            room_messages.pop(roomid)
        return room

    @database_sync_to_async
    def get_room_members(self, roomid):
        room = ChatRoom.objects.get(id=int(roomid))
        return list(room.members.values_list('username', flat=True))
