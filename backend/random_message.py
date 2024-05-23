import random

import django, os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()
from faker import Faker
from django.contrib.auth import get_user_model
from message.models import Message  


def get_random_user():
    return get_user_model().objects.order_by('?').first()

def generate_random_messages(total_messages):
    faker = Faker()

    for _ in range(total_messages):
        sender = get_random_user()
        recipient = get_random_user()

        while recipient == sender:
            recipient = get_random_user()  # Ensure recipient is different from sender

        message = Message(
            sender=sender,
            recipient=recipient,
            subject=faker.sentence(),
            body=faker.paragraph(),
            is_read=random.choice([True, False]),
            sender_deleted=random.choice([True, False]),
            recipient_deleted=random.choice([True, False]),
            warning=random.choice([True, False])
        )
        message.save()

generate_random_messages(1000)