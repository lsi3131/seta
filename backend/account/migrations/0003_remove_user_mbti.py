# Generated by Django 4.2.12 on 2024-05-14 14:25

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0002_alter_user_mbti'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='mbti',
        ),
    ]