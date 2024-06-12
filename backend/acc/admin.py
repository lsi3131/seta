from django.contrib import admin
from .models import User, Mbti, MbtiVote
# Register your models here.

admin.site.register(User)
admin.site.register(Mbti)
admin.site.register(MbtiVote)
