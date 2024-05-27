import django, os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()
from account.models import User, Mbti
from post.models import Post, PostCategory, Comment
from django.db import transaction


def populate_post_mbti():
    # 모든 Post 인스턴스에 대해 순회합니다.
    for post in Post.objects.all():
        # 해당 Post의 작성자의 MBTI를 가져옵니다.
        author_mbti_type = post.author.mbti.mbti_type
        # 해당 MBTI 유형에 해당하는 Mbti 인스턴스를 가져옵니다.
        post_mbti_instance = Mbti.objects.get(mbti_type=author_mbti_type)
        # Post의 post_mbti 필드를 해당 MBTI 인스턴스로 업데이트합니다.
        post.post_mbti = post_mbti_instance
        # 변경 사항을 저장합니다.
        post.save()


def main():
    # 데이터베이스 작업을 트랜잭션으로 묶습니다.
    with transaction.atomic():
        # populate_post_mbti 함수를 호출하여 post_mbti 필드를 채웁니다.
        populate_post_mbti()


if __name__ == "__main__":
    main()
