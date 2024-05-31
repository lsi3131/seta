# Generated by Django 4.2.12 on 2024-05-31 15:32

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('account', '0002_alter_user_following'),
    ]

    operations = [
        migrations.CreateModel(
            name='ChatRoomCategory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='ChatRoom',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_secret', models.BooleanField(default=False)),
                ('password', models.CharField(max_length=128)),
                ('max_members', models.IntegerField(default=4)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('blacklist_users', models.ManyToManyField(related_name='blacklist_user_chat_rooms', to=settings.AUTH_USER_MODEL)),
                ('host_user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='host_user_chat_rooms', to=settings.AUTH_USER_MODEL)),
                ('members', models.ManyToManyField(related_name='member_chat_rooms', to=settings.AUTH_USER_MODEL)),
                ('name', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('restricted_mbtis', models.ManyToManyField(related_name='restricted_mbtis_chat_rooms', to='account.mbti')),
                ('room_category', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='chat.chatroomcategory')),
            ],
        ),
        migrations.CreateModel(
            name='ChatMessage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('room', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='room_chat_messages', to='chat.chatroom')),
                ('sender', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sender_chat_messages', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]