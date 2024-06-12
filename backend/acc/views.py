from django.shortcuts import get_object_or_404, redirect
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.paginator import Paginator
from django.core.mail import EmailMessage
from django.template.loader import render_to_string

from django.contrib.auth.hashers import make_password
from django.contrib.auth import get_user_model
from .permissions import AccountVIEWPermission

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from post.views import serialize_post
from .util import AccountValidator
from .models import Follow, User, Mbti, MbtiVote

from rest_framework_simplejwt.tokens import RefreshToken
from config.serializers import CustomTokenObtainPairSerializer

from django.conf import settings
from allauth.socialaccount.models import SocialAccount
from django.http import HttpResponseRedirect, JsonResponse
from rest_framework import status
from django.shortcuts import redirect
from allauth.socialaccount.models import SocialAccount
from allauth.socialaccount.providers.kakao import views as kakao_view
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
import requests
from json.decoder import JSONDecodeError
from dj_rest_auth.registration.views import SocialLoginView
from django.db.models import Count, Case, When, IntegerField

validator = AccountValidator()
User = get_user_model()

BACK_BASE_URL = settings.BACK_BASE_URL
FRONT_BASE_URL = settings.FRONT_BASE_URL

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
            username=username, password=password, email=email, introduce=introduce, is_active=False)

        subject = ''' '세타' 이메일 인증'''

        message = render_to_string('acc/activate_email.html', {'username': username,
                                                                   "email": email, "BACK_BASE_URL": BACK_BASE_URL})

        is_active_email = EmailMessage(
            subject,
            message,
            to=[email],
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
    permission_classes = [IsAuthenticated]
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
@permission_classes([IsAuthenticated])
def mbtiRank(request, username):
    user = get_object_or_404(User, username=username)
    follower_mbti_ranking = {}
    following_mbti_ranking = {}
    for follower in user.followers.all():
        if follower.mbti:
            follower_mbti_ranking[follower.mbti.mbti_type] = follower_mbti_ranking.get(
                follower.mbti.mbti_type, 0) + 1

    for following in user.following.all():
        if following.mbti:
            following_mbti_ranking[following.mbti.mbti_type] = following_mbti_ranking.get(following.mbti.mbti_type,
                                                                                          0) + 1

    following_mbti_ranking = sorted(
        following_mbti_ranking.items(), key=lambda x: x[1], reverse=True)[:3]
    follower_mbti_ranking = sorted(
        follower_mbti_ranking.items(), key=lambda x: x[1], reverse=True)[:3]

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

        mbti = Mbti.objects.filter(mbti_type__icontains=mbti_type).first()
        if not mbti:
            return Response({"error": f"존재하지 않은 MBTI 포맷입니다.(=${mbti_type})"}, status=status.HTTP_400_BAD_REQUEST)

        user.mbti = mbti
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
        response_like_posts = [serialize_post(post) for post in like_posts]

        paginated_like_posts = {
            'total_page': paginator_like.num_pages,
            "per_page": per_page,
            'results': response_like_posts,
        }
        return Response({"paginated_posts": paginated_posts,
                        "paginated_like_posts": paginated_like_posts},
                        status=status.HTTP_200_OK)

    return Response({"paginated_posts": paginated_posts}, status=status.HTTP_200_OK)


class UserActivateAPIView(APIView):

    def get(self, request, email):
        user = get_object_or_404(User, email=email)

        if user.is_active:
            return redirect(f"{FRONT_BASE_URL}/login")
        else:
            user.is_active = True
            user.save()
            return redirect(f"{FRONT_BASE_URL}/login")


# 아이디 찾기
class FindNameAPIView(APIView):
    def get(self, request, email):
        username = get_object_or_404(User, email=email)

        subject = ''' '세타' 아이디 찾기'''
        message = render_to_string('acc/find_username.html', {'username': username,
                                                                  "email": email,
                                                                  "FRONT_BASE_URL": FRONT_BASE_URL})

        find_uaername_email = EmailMessage(
            subject,
            message,
            to=[email]
        )
        find_uaername_email.content_subtype = "html"
        find_uaername_email.send()

        return Response({"message": "이메일을 확인하세요"}, status=status.HTTP_200_OK)


# 비밀번호 찾기
class FindPasswordAPIView(APIView):
    def put(self, request, email, username):
        user = get_object_or_404(User, email=email, username=username)

        allowed_chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
        random_password = User.objects.make_random_password(
            length=16, allowed_chars=allowed_chars)

        user.password = make_password(random_password)
        user.save()

        subject = ''' '세타' 임시 비밀번호'''
        message = render_to_string('acc/find_password.html', {'username': username,
                                                                  "email": email,
                                                                  "password": random_password,
                                                                  "FRONT_BASE_URL": FRONT_BASE_URL})

        find_password_email = EmailMessage(
            subject,
            message,
            to=[email]
        )
        find_password_email.content_subtype = "html"
        find_password_email.send()

        return Response({"message": "이메일을 확인하세요"}, status=status.HTTP_200_OK)


# social login
SOCIAL_CALLBACK_URI = f"{BACK_BASE_URL}api/accounts/social/callback/"
@api_view(['GET'])
@permission_classes([AllowAny])
def social_login(request):
    # provider = request.GET.get('provider')
    # if provider == 'google':
    #     scope = "https://www.googleapis.com/auth/userinfo.email"
    #     client_id = getattr(settings, "GOOGLE_CLIENT_ID")
    #     redirect_url = (
    #         f"https://accounts.google.com/o/oauth2/v2/auth?client_id={client_id}&response_type=code&redirect_uri={SOCIAL_CALLBACK_URI}&scope={scope}")
    #     return redirect(redirect_url)

    # if provider == 'github':
    client_id = getattr(settings, "GITHUB_CLIENT_ID")
    redirect_url = (
        f"https://github.com/login/oauth/authorize?client_id={client_id}&redirect_uri={SOCIAL_CALLBACK_URI}")
    return redirect(redirect_url)
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def social(request, username) :
    try:
        user = User.objects.get(username=username)
        social_user = SocialAccount.objects.get(user=user)
        return Response({
            "provider": social_user.provider,
        }, status=status.HTTP_200_OK)
    except SocialAccount.DoesNotExist:
        return Response({
            "provider": "local",
        }, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([AllowAny])
def social_callback(request):
    code = request.GET.get('code')
    # scope = request.GET.get('scope')   google인 경우에만 존제

    # if scope:
    #     client_id = getattr(settings, "GOOGLE_CLIENT_ID")
    #     client_secret = getattr(settings, "GOOGLE_CLIENT_SECRET")
    #     state = getattr(settings, 'STATE')
    #     token_req = requests.post(
    #         "https://oauth2.googleapis.com/token",
    #         data={
    #             "client_id": client_id,
    #             "client_secret": client_secret,
    #             "code": code,
    #             "grant_type": "authorization_code",
    #             "redirect_uri": SOCIAL_CALLBACK_URI,
    #             "state": state,

    #         },
    #     )

    #     token_req_json = token_req.json()
    #     if not token_req_json:
    #         return Response({"err_msg": "구글 계정을 확인하세요"}, status=status.HTTP_400_BAD_REQUEST)

    #     access_token = token_req_json.get('access_token')

    #     user_info_req = requests.get(
    #         f"https://www.googleapis.com/oauth2/v1/tokeninfo?access_token={access_token}")
    #     user_info = user_info_req.json()
    #     user_id = user_info.get("user_id")
    #     email = user_info.get('email')
    #     username = email.split('@')[0]
    #     provider = "google"

    # if not scope:
    client_id = getattr(settings, "GITHUB_CLIENT_ID")
    client_secret = getattr(settings, "GITHUB_CLIENT_SECRET")
    token_req = requests.post(
        f'https://github.com/login/oauth/access_token',
        data={
            'client_id': client_id,
            'client_secret': client_secret,
            'code': code
        },
        headers={'Accept': 'application/json'}
    )
    token_req_json = token_req.json()
    access_token = token_req_json.get('access_token')
    user_info_req = requests.get(
        'https://api.github.com/user',
        headers={
            'Authorization': f'token {access_token}',
            'Accept': 'application/json'
        }
    )
    user_info = user_info_req.json()
    username = user_info.get("login")
    user_id = str(user_info.get("id"))
    email = ''
    # provider = "github"


    try:
        user = User.objects.get(username=(f'{username}{user_id[:4]}'))
        social_user = SocialAccount.objects.get(user=user)

        if not social_user.provider:
            return Response({'err_msg': '소셜 로그인 타입이 다릅니다'}, status=status.HTTP_400_BAD_REQUEST)

        refresh = CustomTokenObtainPairSerializer.refresh_token(user)
        access = CustomTokenObtainPairSerializer.get_token(user)

        redirect_url = FRONT_BASE_URL
        respons = HttpResponseRedirect(redirect_url)

        respons.set_cookie('access', str(access), max_age=5)
        respons.set_cookie('refresh', str(refresh), max_age=5)

        return respons

    except User.DoesNotExist:

        if email:
            user, created = User.objects.get_or_create(defaults={'username': (f'{username}{user_id[:4]}')},email=email)
        else: 
            user, created = User.objects.get_or_create(email=username, defaults={'username': (f'{username}{user_id[:4]}')})
        if created:
            user.set_unusable_password()
            user.save()

        # if provider == 'google':
        #     SocialAccount.objects.create(
        #         user=user, provider="google", uid=user_id)
        # elif provider == 'github':
        SocialAccount.objects.create(
            user=user, provider="github", uid=user_id)

        refresh = CustomTokenObtainPairSerializer.refresh_token(user)
        access = CustomTokenObtainPairSerializer.get_token(user)

        redirect_url = FRONT_BASE_URL
        respons = HttpResponseRedirect(redirect_url)

        respons.set_cookie('access', str(access), max_age=20)
        respons.set_cookie('refresh', str(refresh), max_age=20)

        return respons

    except SocialAccount.DoesNotExist:
        return Response({'err_msg': '일반 회원으로 가입된 email입니다.'}, status=status.HTTP_400_BAD_REQUEST)


# 카카오 로그인
KAKAO_CALLBACK_URI = f"{BACK_BASE_URL}/api/accounts/kakao/callback/"  # 프론트 로그인 URI 입력
print(KAKAO_CALLBACK_URI)
@api_view(["GET"])
@permission_classes([AllowAny])
def kakao_callback(request):
    rest_api_key = settings.KAKAO_REST_API_KEY
    code = request.GET.get("code")
    redirect_uri = KAKAO_CALLBACK_URI
    token_req = requests.get(
        f"https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id={rest_api_key}&redirect_uri={redirect_uri}&code={code}"
    )
    token_req_json = token_req.json()
    error = token_req_json.get("error")
    if error is not None:
        raise JSONDecodeError(error)
    access_token = token_req_json.get("access_token")
    profile_request = requests.post(
        "https://kapi.kakao.com/v2/user/me",
        headers={"Authorization": f"Bearer {access_token}"},
    )
    profile_json = profile_request.json()
    error = profile_json.get("error")
    if error is not None:
        raise JSONDecodeError(error)
    kakao_account = profile_json.get("kakao_account")
    profile = kakao_account.get("profile")
    username = profile.get("nickname")
    user_id = str(profile_json.get("id"))

    try:
        user = User.objects.get(username=(f'{username}{user_id[-4:]}'))
        # 기존에 가입된 유저의 Provider가 kakao가 아니면 에러 발생, 맞으면 로그인
        # 다른 SNS로 가입된 유저
        social_user = SocialAccount.objects.get(user=user)
        if social_user is None:
            return JsonResponse(
                {"err_msg": "email exists but not social user"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if social_user.provider != "kakao":
            return JsonResponse(
                {"err_msg": "no matching social type"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # 기존에 kakao로 가입된 유저
        refresh = CustomTokenObtainPairSerializer.refresh_token(user)
        access = CustomTokenObtainPairSerializer.get_token(user)

        respons = HttpResponseRedirect(FRONT_BASE_URL)

        respons.set_cookie('access', str(access), max_age=5)
        respons.set_cookie('refresh', str(refresh), max_age=5)

        return respons

    except User.DoesNotExist:
        # 기존에 가입된 유저가 없으면 새로 가입
        user, created = User.objects.get_or_create(email=username,
            defaults={'username': (f'{username}{user_id[-4:]}')})
        if created:
            user.set_unusable_password()
            user.save()

        SocialAccount.objects.create(user=user, provider="kakao", uid=user_id)
        refresh = CustomTokenObtainPairSerializer.refresh_token(user)
        access = CustomTokenObtainPairSerializer.get_token(user)
        respons = HttpResponseRedirect(FRONT_BASE_URL)

        respons.set_cookie('access', str(access), max_age=5)
        respons.set_cookie('refresh', str(refresh), max_age=5)

        return respons


class AccountMbtiVoteView(APIView):
    permission_classes=[IsAuthenticated]

    def post(self, request, username):
        owner = get_object_or_404(User, username=username)
        voter = request.user
        data = request.data
        vote_type = data['vote_type']
        vote_value = data['vote_value']

        mbti_vote = MbtiVote.objects.filter(mbti_owner=owner, voter=voter, vote_dimension=vote_type).first()
        if not mbti_vote:
            MbtiVote.objects.create(mbti_owner=owner, voter=voter, vote_dimension=vote_type, vote_value=vote_value)

        return Response({"message": "투표에 성공했습니다."}, status=status.HTTP_200_OK)

    def get(self, request, username):
        owner = get_object_or_404(User, username=username)

        mbti_vote_counts = MbtiVote.objects.filter(mbti_owner=owner).aggregate(
            I_count=Count(Case(When(vote_value='I', then=1), output_field=IntegerField())),
            E_count=Count(Case(When(vote_value='E', then=1), output_field=IntegerField())),
            N_count=Count(Case(When(vote_value='N', then=1), output_field=IntegerField())),
            S_count=Count(Case(When(vote_value='S', then=1), output_field=IntegerField())),
            F_count=Count(Case(When(vote_value='F', then=1), output_field=IntegerField())),
            T_count=Count(Case(When(vote_value='T', then=1), output_field=IntegerField())),
            P_count=Count(Case(When(vote_value='P', then=1), output_field=IntegerField())),
            J_count=Count(Case(When(vote_value='J', then=1), output_field=IntegerField()))
        )

        print(mbti_vote_counts)

        return Response(mbti_vote_counts, status=status.HTTP_200_OK)

