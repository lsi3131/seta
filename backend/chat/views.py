from django.shortcuts import render, get_list_or_404, get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, AllowAny
from rest_framework import status
from .models import *

def serialize_chat_message(post):
    return {
        "id": post.id,
        "sender": post.sender.name,
        "content": post.content,
        "created_at": post.created_at,
    }

# Create your views here.
class ChatRoomAPIView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def post(self, request):
        return Response({'todo': 'todo'}, status=status.HTTP_200_OK)

    def get(self, request):
        return Response({'todo': 'todo'}, status=status.HTTP_200_OK)

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

