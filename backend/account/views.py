from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Mbti
from rest_framework import status
from django.contrib.auth import get_user_model
from .permissions import AccountVIEWPermission
# Create your views here.
from rest_framework.decorators import api_view, permission_classes
from .util import AccountValidator
from .models import Follow, User
from rest_framework.permissions import IsAuthenticated

validator = AccountValidator()


class AccountAPIView(APIView):

    permission_classes = [AccountVIEWPermission]

    def post(self, request):
        data = request.data
        username = data.get('username', None)
        password = data.get('password', None)
        email = data.get('email', None)
        introduce = data.get('introduce', '')

        get_user_model().objects.create_user(
            username=username, password=password, email=email, introduce=introduce)

        return Response({
            "username": username,
            "password": password,
            "email": email,
            "introduce": introduce,
        }, status=status.HTTP_201_CREATED)

    def put(self, request):
        # 기존 데이터에서 부분적으로 업데이트 될 수 있도록 짤거고 mbti 가 추가
        user = request.user
        data = request.data
        username = data.get('username', user.username)
        email = data.get('email', user.email)
        introduce = data.get('introduce', user.introduce)
        mbti = data.get('mbti', user.mbti)

        user.username = username
        user.email = email
        user.introduce = introduce
        user.mbti = Mbti.objects.get(mbti_type=mbti)
        user.save()

        return Response({
            "username": username,
            "email": email,
            "introduce": introduce,
            "mbti": mbti,
        }, status=status.HTTP_200_OK)   
    
    def delete(self, request):
        user = request.user
        user.delete()
        return Response({"message": f"계정이 삭제되었습니다"}, status=status.HTTP_204_NO_CONTENT)
    


@api_view(['POST'])
def validate_password(request):
    validator.validate('password', request.data)
    return validator.get_response_data()


@api_view(['POST'])
def validate_username(request):
    validator.validate('username', request.data)
    return validator.get_response_data()


@api_view(['POST'])
def validate_email(request):
    validator.validate('email', request.data)
    return validator.get_response_data()


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def follow(request, username):
    to_user= get_object_or_404(User, username=username)
    from_user = request.user

    #frontend에 'follow'값을 보내주면 'follow'기능 요청
    following = request.data.get('follow',0)

    if following:    
        Follow.objects.get_or_create(
            from_user=from_user,
            to_user=to_user)
        return Response(
            {"message": f"{from_user} following {to_user}"}, status=status.HTTP_200_OK)
    else:
        follower =Follow.objects.filter(from_user=from_user, to_user=to_user)
        follower.delete()
        return Response(
            {"message": f"{from_user} Un following {to_user}"}, status=status.HTTP_200_OK)

