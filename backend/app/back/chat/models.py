# chat/models.py

from django.db import models
from django.conf import settings
from django.db import models
from django.conf import settings
from users.models import User

class Message(models.Model):
	# sender = models.ForeignKey(User, on_delete=models.CASCADE, null=True, related_name='sender')
	room_name = models.CharField(max_length=255)
	content = models.TextField()
	timestamp = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return f'{self.sender.username} in {self.room_name}: {self.content}'

# class Room(models.Model):
# 	id = models.CharField(max_length=255)
# 	users = models.ManyToManyField(User, related_name=, blank=True)


# 	def __str__(self):
# 		return self.name
