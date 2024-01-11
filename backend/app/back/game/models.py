from django.db import models
from users.models import User
import uuid

class Match(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4(), editable=False)
    player1 = models.ForeignKey(User, related_name='lostMatches', on_delete=models.CASCADE)
    player2 = models.ForeignKey(User, related_name='wonMatches', on_delete=models.CASCADE)

    def __str__(self) -> str:
        return (f"{self.player1.username} - {self.player2.username}")
