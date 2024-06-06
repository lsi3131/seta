from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import ValidationError
from acc.models import User
from django.contrib.auth.hashers import check_password




class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    
    def validate(self, attrs):
        username = attrs['username']
        password = attrs['password']
        try:
            user = User.objects.get(username=username)
        except:
            raise ValidationError({"detail":"아이디가 틀렸습니다"})
        
        if not check_password(password, user.password):
            raise ValidationError({"detail":"비밀번호가 틀렸습니다."})
        
        if not user.is_active:
            raise ValidationError({"detail":"이메일 인증을 해주세요"})
        
        return super().validate(attrs)


    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username 
        token['mbti_type'] = user.mbti.mbti_type if user.mbti else None
        return token
    


    @classmethod
    def refresh_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['mbti_type'] = user.mbti.mbti_type if user.mbti else None
        return token