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

def get_random_user():
    return get_user_model().objects.order_by('?').first()

def generate_chatroom(count):
    for _ in range(count):
        member_count = random.choice((1, 2, 3, 4, 5, 6))
        name = random.choice(('ㅇㅇ', 'ㅋㅋ', 'ㅎㅎㅓ'))
        category = ChatRoomCategory.objects.get(name=random.choice(('game', 'chat')))
        is_secret = random.choice((True, False))
        password = '1234'
        host_user = get_random_user()
        ChatRoom.objects.create(name=name, room_category=category, max_members=member_count,
                                        is_secret=is_secret, host_user=host_user, password=password)



print('===========generate started==========')

generate_chatroom(100)

print('===========generate finished==========')
