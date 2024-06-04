import random
from django_seed import Seed
import django
import os
from django.contrib.auth import get_user_model

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from post.models import *
from chat.models import *
from acc.models import Mbti

User = get_user_model()

def generate_mbti():
    mbtis = {
        "intj": "전략가",
        "intp": "논리술사",
        "entj": "통솔가",
        "entp": "변론가",
        "esfp": "활동가",
        "estp": "사업가",
        "isfp": "모험가",
        "istp": "장인",
        "esfj": "집정관",
        "isfj": "수호자",
        "istj": "현실주의자",
        "estj": "경영자",
        "infj": "옹호자",
        "infp": "중재자",
        "enfj": "선도자",
        "enfp": "활동가",
    }
    for mbti, description in mbtis.items():

        found = Mbti.objects.filter(mbti_type__icontains=mbti).first()
        if not found:
            m = Mbti(
                mbti_type=mbti,
                description=description
            )
            m.save()
        else:
            found.description = description


def generate_post_categories():
    categories = [
        "유머",
        "질문",
        "자유",
    ]

    for cate in categories:
        found = PostCategory.objects.filter(name__icontains=cate).first()
        if not found:
            pc = PostCategory(name=cate)
            pc.save()
        else:
            found.name = cate


def generate_chat_categories():
    categories = [
        "chat",
        "game",
    ]

    for obj in ChatRoomCategory.objects.all():
        obj.delete()

    for cate in categories:
        found = ChatRoomCategory.objects.filter(name__icontains=cate).first()
        if not found:
            pc = ChatRoomCategory(name=cate)
            pc.save()
        else:
            found.name = cate

def generate_test_user():
    test_user_list = [
        ("test1", "1234", "test1@test.com"),
        ("test2", "1234", "test2@test.com"),
        ("test3", "1234", "test3@test.com"),
        ("test4", "1234", "test4@test.com"),
    ]

    for user in test_user_list:
        found = User.objects.filter(username__icontains=user[0]).first()
        if not found:
            User.objects.create_user(username=user[0], password=user[1], email=user[2])
        else:
            pass



print('===========generate started==========')

generate_mbti()
generate_post_categories()
generate_chat_categories()
generate_test_user()

print('===========generate finished==========')