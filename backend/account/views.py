from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
# Create your views here.
from rest_framework.decorators import api_view
from .util import AccountValidator
from .models import Follow, User

validator = AccountValidator()


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
def follow(request, username):
    to_user= get_object_or_404(User, username=username)
    from_user = request.user

    if request.data:
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