# chat/models.py

from django.db import models
from django.conf import settings

class Message(models.Model):
    # sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    room_name = models.CharField(max_length=255)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.sender.username} in {self.room_name}: {self.content}'
