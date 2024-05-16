from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from django.contrib.auth import get_user_model
from .permissions import AccountVIEWPermission

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from post.views import serialize_post
from .util import AccountValidator
from .models import Follow, User, Mbti


validator = AccountValidator()
User = get_user_model()

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

class ProfileAPIView(APIView):
    def get(self, request, username):
        user = get_object_or_404(User, username=username)
        user_mbti = user.mbti
        return Response({
            "username": user.username,
            "email": user.email,
            "introduce": user.introduce,
            "mbti": user_mbti.mbti_type if user_mbti else None,
            "mbti_description": user_mbti.description if user_mbti else "",
            "percentIE": user.percentIE,
            "percentNS": user.percentNS,
            "percentFT": user.percentFT,
            "percentPJ": user.percentPJ,
            "following_count": user.following.count(),
            "followers_count": user.followers.count(),
            "posts": [ serialize_post(post) for post in user.post_set.all() ],
            "like_posts": [ serialize_post(post) for post in user.like_posts.all() ]
        }, status=status.HTTP_200_OK)

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

