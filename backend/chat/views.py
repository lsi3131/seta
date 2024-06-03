from django.shortcuts import render, get_list_or_404, get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, AllowAny
from rest_framework import status
from .models import *
from rest_framework.decorators import api_view
from django.contrib.auth import get_user_model
from .models import ChatRoom, ChatMessage, ChatRoomCategory
from .validate import validate_chatroom_data


def serialize_chat_message(post):
    return {
        "id": post.id,
        "sender": post.sender.name,
        "content": post.content,
        "created_at": post.created_at,
    }

def serialize_chatroom(chatroom):
    return {
        'id': chatroom.id,
        'name': chatroom.name,
        'is_secret': chatroom.is_secret,
        'max_members': chatroom.max_members,
        'host_user': chatroom.host_user.username,
        'room_category': chatroom.room_category.name,
        'created_at': chatroom.created_at.strftime('%Y-%m-%d %H:%M'),
        'members_count': chatroom.members.count(),
        'restricted_mbtis': [mbti.mbti_type for mbti in chatroom.restricted_mbtis.all()],
    }


def serialize_chatroom_category(chatroom_category):
    return {
        'id': chatroom_category.id,
        'name': chatroom_category.name
    }


class ChatRoomAPIView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def post(self, request):
        data = request.data.copy()
        message = validate_chatroom_data(data)
        host_user = request.user
        if message:
            return Response(message, status=status.HTTP_400_BAD_REQUEST)

        name = data.get('name')
        category_name = data.get('category')
        category = get_object_or_404(ChatRoomCategory, name=category_name)
        member_count = data.get('member_count')
        is_secret = data.get('is_secret')
        password = data.get('password')
        chat_room = ChatRoom.objects.create(name=name, room_category=category, max_members=member_count,
                                            is_secret=is_secret, host_user=host_user, password=password)

        chat_room.members.add(request.user)

        return Response({'chatroom_id': chat_room.id}, status=status.HTTP_200_OK)

    def get(self, request):
        cate = request.GET.get('category', 'chat')
        roomCate = ChatRoomCategory.objects.get(name=cate)
        chatrooms = ChatRoom.objects.filter(room_category=roomCate)
        data = [serialize_chatroom(chatroom) for chatroom in chatrooms]
        return Response(data, status=status.HTTP_200_OK)


    def put(self, request, chatroom_pk):
        return Response({'todo': 'todo'}, status=status.HTTP_200_OK)

    def delete(self, request, chatroom_pk):
        return Response({'todo': 'todo'}, status=status.HTTP_200_OK)


class ChatMessageAPIView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    def get(self, request, chatroom_pk):
        queryset = ChatMessage.objects.filter(room=chatroom_pk)
        if not queryset.exists():
            return Response({'error': '존재하지 않는 채팅방입니다.'}, status=status.HTTP_400_BAD_REQUEST)
        serialize = serialize_chat_message(queryset)
        return Response(serialize, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_category(request):
    categories = ChatRoomCategory.objects.all()

    serialized_datas = [serialize_chatroom_category(cate) for cate in categories]

    return Response(serialized_datas, status=status.HTTP_200_OK)
