import django, os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()
from account.models import User, Mbti
from post.models import Post, PostCategory, Comment
from django.db import transaction


def check_post_mbti():
    for post in Post.objects.all():
        if not post.post_mbti:
            print(f'post mbti not exist = {post}')
            assert False


def check_comment_mbti():
    for comment in Comment.objects.all():
        if not comment.comment_mbti:
            print(f'comment mbti not exist = {comment}')
            assert False

def main():
    with transaction.atomic():
        check_post_mbti()
        check_comment_mbti()


if __name__ == "__main__":
    main()
