import django, os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()
from account.models import User, Mbti
from post.models import Post, PostCategory, Comment
from django.db import transaction


def populate_post_mbti():
    for post in Post.objects.all():
        author_mbti_type = post.author.mbti.mbti_type
        post_mbti_instance = Mbti.objects.get(mbti_type=author_mbti_type)
        post.post_mbti = post_mbti_instance
        post.save()


def populate_comment_mbti():
    for comment in Comment.objects.all():
        author_mbti_type = comment.author.mbti.mbti_type
        comment_mbti_instance = Mbti.objects.get(mbti_type=author_mbti_type)
        comment.comment_mbti = comment_mbti_instance
        comment.save()

def main():
    with transaction.atomic():
        populate_post_mbti()


if __name__ == "__main__":
    main()
