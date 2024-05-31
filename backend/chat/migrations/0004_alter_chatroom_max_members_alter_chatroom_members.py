# Generated by Django 4.2.12 on 2024-05-31 17:12

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("chat", "0003_alter_chatroom_blacklist_users_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="chatroom",
            name="max_members",
            field=models.IntegerField(default=4),
        ),
        migrations.AlterField(
            model_name="chatroom",
            name="members",
            field=models.ManyToManyField(
                blank=True,
                related_name="member_chat_rooms",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
    ]