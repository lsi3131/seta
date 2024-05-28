from django.db import models
from config.settings import AUTH_USER_MODEL
from account.models import Mbti


class PostCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


# Create your models here.
class Post(models.Model):
    author = models.ForeignKey(AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    category = models.ForeignKey(PostCategory, on_delete=models.CASCADE, related_name='cate_posts')
    likes = models.ManyToManyField(AUTH_USER_MODEL, related_name='like_posts', blank=True)
    mbti = models.ManyToManyField(Mbti, related_name='mbti_posts', blank=True, )
    hits = models.IntegerField(default=0)
    post_mbti = models.ForeignKey(Mbti, on_delete=models.CASCADE, default=None, null=True)

    def __str__(self):
        return self.title
    
class PostImage(models.Model) :
    name = models.CharField(max_length=30)
    picture = models.FileField(upload_to='media/')


class Comment(models.Model):
    author = models.ForeignKey(AUTH_USER_MODEL, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')
    content = models.TextField()
    recommend = models.ManyToManyField(AUTH_USER_MODEL, related_name='recommend_comments', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    comment_mbti = models.ForeignKey(Mbti, on_delete=models.CASCADE, default=None, null=True)

    def __str__(self):
        return self.content
