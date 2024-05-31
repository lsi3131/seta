from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, AllowAny
from rest_framework import status


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


class ChtMessageAPIView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def post(self, request, chatroom_pk):
        return Response({'todo': 'todo'}, status=status.HTTP_200_OK)

    def get(self, request, chatroom_pk):
        return Response({'todo': 'todo'}, status=status.HTTP_200_OK)

