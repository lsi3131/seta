from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password
# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .util import AccountValidator

validator = AccountValidator()
User = get_user_model()


class AccountAPIView(APIView):

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


class AccountPasswordAPIView(APIView):
    # permission_classes = [IsAuthenticatedOrReadOnly]

    def put(self, request):
        data = request.data
        user = request.user

        old_password = data.get('old_password', None)
        new_password = data.get('new_password', None)

        if not old_password or not new_password:
            return Response({"error": "잘못된 전송 포맷입니다."}, status=status.HTTP_400_BAD_REQUEST)

        # 이전 비밀번호 일치 체크
        if not check_password(old_password, user.password):
            return Response({"error": "비밀번호가 일치하지 않습니다."}, status=status.HTTP_400_BAD_REQUEST)

        # 신규 비밀번호 유효성 체크
        if not validator.validate('password', {'data': new_password}):
            return validator.get_response_data()

        user.set_password(new_password)
        user.save()

        return Response({"message": "비밀번호가 수정되었습니다."}, status=status.HTTP_200_OK)

    def post(self, request):
        data = request.data
        user = request.user

        password = data.get('password', None)

        if not password:
            return Response({"error": "잘못된 전송 포맷입니다."}, status=status.HTTP_400_BAD_REQUEST)

        # 비밀번호 일치 체크
        if not check_password(password, user.password):
            return Response({"error": "비밀번호가 일치하지 않습니다."}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": "인증에 성공했습니다."}, status=status.HTTP_200_OK)


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
