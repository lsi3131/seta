from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from .models import Message

from .permissions import MessageAccessPermission

from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated


class MessageAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if not user.is_authenticated:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
        
        sent_messages = Message.objects.filter(sender=user, sender_deleted=False).values('id', 'recipient__username', 'subject', 'parent', 'timestamp', 'is_read')
        received_messages = Message.objects.filter(recipient=user, recipient_deleted=False).values('id', 'sender__username', 'subject', 'parent', 'timestamp', 'is_read')
        return Response({
            'sent_messages': list(sent_messages),
            'received_messages': list(received_messages)
        })

    def post(self, request):
        if not request.user.is_authenticated:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
        
        try:
            data = request.data
            recipient = get_user_model().objects.get(username=data['recipient'])
            subject = data['subject']
            body = data['body']

            Message.objects.create(
                sender=request.user,
                recipient=recipient,
                subject=subject,
                body=body
            )
            return Response({
                "message": "메세지가 성공적으로 전송되었습니다"
            }, status=status.HTTP_201_CREATED)
        except get_user_model().DoesNotExist:
            return Response({'error': '수신자가 존재하지 않습니다'}, status=status.HTTP_400_BAD_REQUEST)    
        except KeyError:
            return Response({'error': '입력값 오류입니다'}, status=status.HTTP_400_BAD_REQUEST)

class MessageDetailAPIView(APIView):
    permission_classes = [IsAuthenticated, MessageAccessPermission]
    def get(self, request, message_id):
        try:
            message = Message.objects.get(id=message_id)
            if message.is_read == False and request.user == message.recipient:
                message.is_read = True
                message.save()
            return Response({
                'id': message.id,
                'sender': message.sender.username,
                'recipient': message.recipient.username,
                'subject': message.subject,
                'body': message.body,
                'timestamp': message.timestamp,
                'is_read': message.is_read
            }, status=status.HTTP_200_OK)
        except Message.DoesNotExist:
            return Response({'error': '메세지가 삭제되었습니다'}, status=status.HTTP_404_NOT_FOUND)
        
    def delete(self, request, message_id):
        try:
            message = Message.objects.get(id=message_id)

            if request.user == message.sender:
                message.sender_deleted = True
            elif request.user == message.recipient:
                message.recipient_deleted = True
            
            if message.sender_deleted and message.recipient_deleted:
                message.delete()
            else:
                message.save()
            return Response({'success': '메세지가 삭제되었습니다'}, status=status.HTTP_204_NO_CONTENT)
        except Message.DoesNotExist:
            return Response({'error': '메세지가 삭제되었습니다'}, status=status.HTTP_404_NOT_FOUND)




