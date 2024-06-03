import random
from django_seed import Seed
import django, os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()
from faker import Faker
from acc.models import User, Mbti

def generate_random_users(total_users):
    seeder = Seed.seeder()
    faker = Faker()

    # 사용자 정보 랜덤 생성
    seeder.add_entity(User, total_users, {
        'username': lambda x: faker.user_name(),
        'email': lambda x: faker.email(),
        'password': 'pbkdf2_sha256$600000$tXmX60GePKH2n2qqYjBkJi$OaWav+TrpbAv5pJ7bfvaKx6AeUfqTFlb+Z+e8Yzc6wg=',  # 여기에 원하는 패스워드를 넣어주세요.
        'introduce': lambda x: faker.text(),
        'percentIE': lambda x: round(random.uniform(0, 100), 1),
        'percentNS': lambda x: round(random.uniform(0, 100), 1),
        'percentFT': lambda x: round(random.uniform(0, 100), 1),
        'percentPJ': lambda x: round(random.uniform(0, 100), 1),
        'mbti': lambda x: Mbti.objects.order_by('?').first(),  # Mbti 모델에서 랜덤하게 선택
    })

    # 실행
    seeder.execute()

# 원하는 사용자 수 지정
generate_random_users(150)  #