from django.db import models
from config.settings import AUTH_USER_MODEL


class PostCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)


# Create your models here.
class Post(models.Model):
    author = models.ForeignKey(AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    category = models.ForeignKey(PostCategory, on_delete=models.CASCADE, related_name='posts')
    likes = models.ManyToManyField(AUTH_USER_MODEL, related_name='likes', blank=True)


# class PostLike(models.Model):

