from django.db import models
from config.settings import AUTH_USER_MODEL

class Message(models.Model):
    sender = models.ForeignKey(AUTH_USER_MODEL, related_name='sent_messages', on_delete=models.CASCADE)
    recipient = models.ForeignKey(AUTH_USER_MODEL, related_name='received_messages', on_delete=models.CASCADE)
    subject = models.CharField(max_length=255)
    body = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    parent = models.ForeignKey('self', null=True, blank=True, related_name='replies', on_delete=models.CASCADE)
    sender_deleted = models.BooleanField(default=False)
    recipient_deleted = models.BooleanField(default=False)  
    warning = models.BooleanField(default=False)

    def __str__(self):
        return f"<to: {self.recipient}, from: {self.sender}> subject: {self.subject}"