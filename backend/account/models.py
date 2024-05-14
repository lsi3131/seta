from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

class User(AbstractUser):
    # login email 로 ~ 
    email = models.EmailField(unique=True)
    introduce = models.TextField(blank=True)
    following = models.ManyToManyField("self", symmetrical=False, through="Follow", related_name="followers")
    
    percentIE = models.FloatField(default=0)
    percentNS = models.FloatField(default=0)
    percentFT = models.FloatField(default=0)
    percentPJ = models.FloatField(default=0)
    