from django.test import TestCase
from django.contrib.auth import get_user_model
from .models import *


User = get_user_model()


class PostModelTest(TestCase):
    def setUp(self):
        pass

    def test_post_categories(self):
        user = User.objects.create_user(username='test', email='email@test.com', password='1234')
        post_category = PostCategory.objects.create(name='isfp')
        post = Post.objects.create(title='title', content='content', author=user, category=post_category)
        post.likes.add(user)

        post_result = Post.objects.get(title='title')
        self.assertEqual('title', post_result.title)
        self.assertEqual(1, post_result.likes.count())
