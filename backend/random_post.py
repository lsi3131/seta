import random
from django_seed import Seed
import django
import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()
from faker import Faker
from post.models import Post, PostCategory, Comment
from django.contrib.auth import get_user_model
from account.models import Mbti



def get_random_user():
    return get_user_model().objects.order_by('?').first()

def get_random_mbti():
    return Mbti.objects.order_by('?').first()
def generate_random_posts(total_posts):
    seeder = Seed.seeder()
    faker = Faker()

    for _ in range(total_posts):
        author = get_random_user()
        category = PostCategory.objects.order_by('?').first()

        post = Post(
            author=author,
            title=faker.sentence(),
            content=faker.paragraph(),
            category=category,
            hits=random.randint(0, 1000)
        )
        post.save()

        liked_users = [get_random_user() for _ in range(random.randint(0, 5))]
        post.likes.add(*liked_users)

        mbtis = [get_random_mbti() for _ in range(random.randint(0, 5))]
        post.mbti.add(*mbtis)

def generate_random_comments(total_comments):
    seeder = Seed.seeder()
    faker = Faker()

    for _ in range(total_comments):
        author = get_random_user()
        post = Post.objects.order_by('?').first()
        parent_comment = random.choice([Comment.objects.order_by('?').first(), None])

        comment = Comment(
            author=author,
            post=post,
            parent=parent_comment,
            content=faker.sentence(),
        )
        comment.save()

        recommend_users = [get_random_user() for _ in range(random.randint(0, 5))]
        comment.recommend.add(*recommend_users)

generate_random_posts(1000)  
generate_random_comments(1000)