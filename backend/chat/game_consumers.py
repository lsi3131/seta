import json
import collections
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import *
from django.contrib.auth import get_user_model
from collections import defaultdict
from collections import Counter
from .bot import AIChatBot

User = get_user_model()
room_messages = defaultdict(list)
room_ai_chat_bots = {}
voted_user_choice = {}

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        if self.room_name not in room_ai_chat_bots:
            room_ai_chat_bots[self.room_name] = None

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

            # '!'로 시작할 시 AI 처리
            if message[0] == '!':
                message = message[1:]
                ai_chat_bot = room_ai_chat_bots[self.room_name]
                if ai_chat_bot is None:
                    print('챗봇이 설정되지 않았습니다.')
                    await self.channel_layer.group_send(
                        self.room_group_name,
                        {
                            'type': 'chat_message',
                            'message': '챗봇이 설정되지 않았습니다.',
                            'username': 'AI',
                            'message_type': 'ai_message_error',
                        }
                    )
                    return

                # 게임시작, 다시시작 명령어 처리
                if message in ('게임시작', '다시시작'):
                    ai_message = await ai_chat_bot.response(message)
                    print(f'send message={message}, ai response message={ai_message}')
                    ai_message = ai_message.replace('\n', '\\n')
                    print(f'replace message={ai_message}')
                    json_data = json.loads(ai_message)
                    print(f'parsed json_data={json_data}')

                    await self.channel_layer.group_send(
                        self.room_group_name,
                        {
                            'type': 'chat_message',
                            'message': json_data,
                            'username': 'AI',
                            'message_type': 'ai_message_start',
                        }
                    )

                # 1,2,3 선택지 처리
                elif message in ('1', '2', '3'):
                    # 멤버별 투표 결과 저장
                    voted_user_choice[username] = int(message)
                    print(f'{username} vote to {message}')

                    # 멤버 개수만큼 투표가 진행되면 다음 step 진행
                    if len(voted_user_choice) == ai_chat_bot.member_count:
                        c = Counter(voted_user_choice.values())
                        select_num = c.most_common(1)[0][0]
                        # 투표결과 초기화
                        voted_user_choice.clear()
                        print(f'most voted number: {select_num}')

                        # AI 메시지 전송
                        ai_message = await ai_chat_bot.response(str(select_num))
                        print(f'send message={message}, ai response message={ai_message}')
                        ai_message = ai_message.replace('\n', '\\n')
                        print(f'replace message={ai_message}')
                        json_data = json.loads(ai_message)
                        print(f'parsed json_data={json_data}')

                        await self.channel_layer.group_send(
                            self.room_group_name,
                            {
                                'type': 'chat_message',
                                'message': json_data,
                                'username': 'AI',
                                'message_type': 'ai_message',
                            }
                    )
                else:
                    print(f'invalid message(={message})')
                    await self.channel_layer.group_send(
                        self.room_group_name,
                        {
                            'type': 'chat_message',
                            'message': '잘못된 메시지 타입입니다.',
                            'username': 'AI',
                            'message_type': 'ai_message_error',
                        }
                    )

        if message_type == 'setting':
            print(f'setting data={data}')
            title = data['title']
            instruction = data['instruction']
            member_count = data['member_count']
            room_ai_chat_bots[self.room_name] = AIChatBot(title, instruction, member_count)

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

    async def chat_message(self, event):
        message = event['message']
        username = event['username']
        message_type = event['message_type']

        print(message_type)
        if message_type == 'enter':
            self.members = await self.enter_room(self.room_name, username)
        elif message_type == 'leave':
            self.members = await self.leave_room(self.room_name, username)

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
        return list(room.members.values_list('username', flat=True))

    @database_sync_to_async
    def leave_room(self, roomid, username):
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
            return []

    @database_sync_to_async
    def get_room_members(self, roomid):
        room = ChatRoom.objects.get(id=int(roomid))
        return list(room.members.values_list('username', flat=True))
