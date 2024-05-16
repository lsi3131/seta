from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Mbti
from rest_framework import status
from django.contrib.auth import get_user_model
from .permissions import AccountVIEWPermission
# Create your views here.

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
        