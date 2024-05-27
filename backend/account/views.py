from django.shortcuts import get_object_or_404, redirect
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.paginator import Paginator
from django.core.mail import EmailMessage
from django.template.loader import render_to_string

from django.contrib.auth import get_user_model
from .permissions import AccountVIEWPermission

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly,AllowAny
from post.views import serialize_post
from .util import AccountValidator
from .models import Follow, User, Mbti

from rest_framework_simplejwt.tokens import RefreshToken
from config.serializers import CustomTokenObtainPairSerializer

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

        validate_type_values = {
            'username': username,
            'password': password,
            'email': email,
        }

        for v_type, value in validate_type_values.items():
            request_data = {'data': value}
            if not validator.validate(v_type, request_data):
                return validator.get_response_data()

        get_user_model().objects.create_user(
            username=username, password=password, email=email, introduce=introduce, is_active = False)


        subject = ''' '세타' 이메일 인증'''
        message = render_to_string('account/email.html', {'username': username, "email":email})
        
        is_active_email = EmailMessage(
            subject,
            message,
            to = ['bmkim766@naver.com']
            )
        is_active_email.content_subtype = "html"
        is_active_email.send()
        
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
        email = data.get('email', user.email)
        introduce = data.get('introduce', user.introduce)

        if data.get('email') and not validator.validate('email', {'data': email}):
            return validator.get_response_data()


        user.email = email
        user.introduce = introduce
        user.save()

        return Response({
            "message": "회원 정보가 수정되었습니다"
        }, status=status.HTTP_200_OK)

    def delete(self, request):
        user = request.user
        print(request.data)
        if request.data.get('password') and check_password(request.data.get('password'), user.password):       
            user.delete()
            return Response({"message": f"계정이 삭제되었습니다"}, status=status.HTTP_204_NO_CONTENT)
        return Response({"error": "비밀번호가 일치하지 않습니다."}, status=status.HTTP_400_BAD_REQUEST)


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
            return Response({"error": "입력하신 비밀번호가 이전과 일치하지 않습니다."}, status=status.HTTP_400_BAD_REQUEST)

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
            "posts_count": user.post_set.count()
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


@api_view(['GET'])
def mbtiRank(request, username):
    user = get_object_or_404(User, username=username)
    follower_mbti_ranking = {}
    following_mbti_ranking = {}
    for follower in user.followers.all():
        if follower.mbti:
            follower_mbti_ranking[follower.mbti.mbti_type] = follower_mbti_ranking.get(follower.mbti.mbti_type, 0) + 1

    for following in user.following.all():
        if following.mbti:
            following_mbti_ranking[following.mbti.mbti_type] = following_mbti_ranking.get(following.mbti.mbti_type,
                                                                                          0) + 1

    following_mbti_ranking = sorted(following_mbti_ranking.items(), key=lambda x: x[1], reverse=True)[:3]
    follower_mbti_ranking = sorted(follower_mbti_ranking.items(), key=lambda x: x[1], reverse=True)[:3]

    return Response({
        "following": following_mbti_ranking,
        "follower": follower_mbti_ranking
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def follow(request, username):
    to_user = get_object_or_404(User, username=username)
    from_user = request.user

    # frontend에 'follow'값을 보내주면 'follow'기능 요청
    following = request.data.get('follow', 0)

    if following:
        Follow.objects.get_or_create(
            from_user=from_user,
            to_user=to_user)
        return Response(
            {"message": f"{from_user} following {to_user}"}, status=status.HTTP_200_OK)
    else:
        follower = Follow.objects.filter(from_user=from_user, to_user=to_user)
        follower.delete()
        return Response(
            {"message": f"{from_user} Un following {to_user}"}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_follow(request, username):
    follow_user = get_object_or_404(User, username=request.user.username)
    exists = follow_user.following.filter(username=username).exists()

    if exists:
        return Response({'follow': 1}, status=status.HTTP_200_OK)
    else:
        return Response({'follow': 0}, status=status.HTTP_200_OK)


class MbtiAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        data = request.data
        user = request.user
        mbti_type = data.get('mbti_type', None)

        if not mbti_type:
            return Response({"error": "잘못된 전송 포맷입니다."}, status=status.HTTP_400_BAD_REQUEST)

        user.mbti = Mbti.objects.get(mbti_type=mbti_type)
        user.percentIE = data.get('percentIE', 0)
        user.percentNS = data.get('percentNS', 0)
        user.percentFT = data.get('percentFT', 0)
        user.percentPJ = data.get('percentPJ', 0)
        user.save()

        serialized_token = CustomTokenObtainPairSerializer.get_token(user)
        tokens = {
            'accessToken': str(serialized_token.access_token),
            'refreshToken': str(serialized_token)
        }
        return Response(tokens, status=status.HTTP_200_OK)


class MbtiDetailAPIView(APIView):
    def get(self, request, mbti_type):
        mbti = Mbti.objects.get(mbti_type__icontains=mbti_type)

        if not mbti:
            return Response({"error": "존재하지 않는 타입입니다."}, status=status.HTTP_400_BAD_REQUEST)

        serialize_data = {
            'mbti_type': mbti_type,
            'description': mbti.description
        }

        return Response(serialize_data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def Myposts(request, username):
    user = get_object_or_404(User, username=username)
    posts = user.post_set.all().order_by('-created_at')
    like_posts = user.like_posts.all().order_by('-created_at')

    per_page = 10
    paginator_post = Paginator(posts, per_page)

    page_number = request.GET.get("page")
    if page_number:
        posts = paginator_post.get_page(page_number)
    response_posts = [serialize_post(post) for post in posts]

    paginated_posts = {
        'total_page': paginator_post.num_pages,
        "per_page": per_page,
        'results': response_posts,
    }


    if str(request.user) == username:
        paginator_like = Paginator(like_posts, per_page)
        if page_number:
            like_posts = paginator_like.get_page(page_number)
        response_like_posts = [serialize_post(post) for post in like_posts ]

        paginated_like_posts = {
            'total_page': paginator_like.num_pages,
            "per_page": per_page,
            'results': response_like_posts,
        }
        return Response({"paginated_posts":paginated_posts,
                        "paginated_like_posts":paginated_like_posts}, 
                        status=status.HTTP_200_OK)
    
    return Response({"paginated_posts":paginated_posts}
                    ,status=status.HTTP_200_OK)




class UserActivateAPIView(APIView):

    def get(self, request, email):
        user = get_object_or_404(User, email=email)
        
        if not user.is_active:
            user.is_active = True
            user.save()
            return redirect("http://localhost:3000/login")
        
            