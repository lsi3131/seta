from django.contrib import admin
from .models import Post, PostCategory, Comment


class PostAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'author', 'category')


class CommentAdmin(admin.ModelAdmin):
    list_display = ('id', 'content', 'author', 'parent', 'post')


admin.site.register(Post, PostAdmin)
admin.site.register(PostCategory)
admin.site.register(Comment, CommentAdmin)
