from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.response import Response


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):

        data = super().validate(attrs)
        user = self.user
        if user.is_active:
            print(1)
        return data


    @classmethod
    def get_token(cls, user):
        
        if user.is_active:
            token = super().get_token(user)
            token['username'] = user.username 
            token['mbti_type'] = user.mbti.mbti_type if user.mbti else None
            return token
        else: 
            return Response({})


    @classmethod
    def refresh_token(cls, user):
        
        token = super().get_token(user)

        # Refresh custom claims to the token payload
        token['username'] = user.username
        token['mbti_type'] = user.mbti.mbti_type if user.mbti else None
        return token
    
    