from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from .models import Message

from .permissions import MessageAccessPermission
from django.core.paginator import Paginator

from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated


class MessageAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        message_type = request.query_params.get('type', 'received')
        page = request.query_params.get('page', 1)
        per_page = 20

        if message_type == 'sent':
            messages = Message.objects.filter(sender=user, sender_deleted=False).values('id', 'recipient__username', 'subject', 'parent', 'timestamp', 'is_read')
        else:
            messages = Message.objects.filter(recipient=user, recipient_deleted=False).values('id', 'sender__username', 'subject', 'parent', 'timestamp', 'is_read')
        
        paginator = Paginator(messages, per_page)
        messages = paginator.get_page(page)
        results = []
        for message in messages:
            message['timestamp'] = message['timestamp'].strftime('%Y-%m-%d %H:%M:%S')
            if message_type == 'sent':
                results.append(message)
            else:
                results.append(message)
        
        paginated_response_data = {
            'total_page': paginator.num_pages,
            "per_page": per_page,
            'results': results,
        }
        return Response(paginated_response_data, status=status.HTTP_200_OK)
    

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
            self.check_object_permissions(request, message)
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
            self.check_object_permissions(request, message)
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


class MessageDeleteAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        ids = request.data.get('ids', [])
        if not ids:
            return Response({'detail': '삭제할 메세지가 선택되어 있지 않습니다.'}, status=status.HTTP_400_BAD_REQUEST)
        
        messages = Message.objects.filter(id__in=ids)
        if not messages.exists():
            return Response({'detail': '존재하지 않는 메세지가 존재합니다.'}, status=status.HTTP_404_NOT_FOUND)
        
        deleted_count = 0
        for message in messages:
            if request.user == message.sender:
                message.sender_deleted = True
            elif request.user == message.recipient:
                message.recipient_deleted = True
            deleted_count += 1

            if message.sender_deleted and message.recipient_deleted:
                message.delete()
            else:
                message.save()

        return Response({'message': f'{deleted_count} 건의 메세지가 삭제되었습니다.'}, status=status.HTTP_204_NO_CONTENT)



