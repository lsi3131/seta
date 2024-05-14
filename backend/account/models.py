from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

class Mbti(models.Model):
    mbti_type = models.CharField(max_length=4, unique=True)
    description = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.mbti_type} - {self.description}"

class User(AbstractUser):
    # login email 로 ~ 
    email = models.EmailField(unique=True)
    introduce = models.TextField(blank=True)
    following = models.ManyToManyField("self", symmetrical=False, through="Follow", related_name="followers")
    percentIE = models.FloatField(default=0)
    percentNS = models.FloatField(default=0)
    percentFT = models.FloatField(default=0)
    percentPJ = models.FloatField(default=0)
    mbti = models.ForeignKey(Mbti, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return self.username
    

class Follow(models.Model):
    from_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="following_set")
    to_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="follower_set")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.from_user} follows {self.to_user}"
    