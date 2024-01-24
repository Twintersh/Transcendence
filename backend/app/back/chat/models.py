# chat/models.py
import uuid
from django.db import models
from django.conf import settings
from django.db import models
from django.conf import settings
from users.models import User


class Room(models.Model):
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	users = models.ManyToManyField(User, related_name='ChatRooms', blank=True)

	def __str__(self):
		return self.id

class Message(models.Model):
	sender = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
	room = models.ForeignKey('Room', on_delete=models.CASCADE, null=True, related_name='messages')
	content = models.TextField()
	timestamp = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return f'{self.sender.username} in {self.room.id}: {self.content}'