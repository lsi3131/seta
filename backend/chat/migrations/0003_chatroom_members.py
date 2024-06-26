# Generated by Django 4.2.12 on 2024-06-05 00:11

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("chat", "0002_remove_chatroom_members_chatroommember"),
    ]

    operations = [
        migrations.AddField(
            model_name="chatroom",
            name="members",
            field=models.ManyToManyField(
                blank=True,
                related_name="member_chat_rooms",
                through="chat.ChatRoomMember",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
    ]
