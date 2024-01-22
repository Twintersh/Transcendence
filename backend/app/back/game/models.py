from django.db import models
from django.dispatch import receiver
from django.db.models.signals import post_save, post_delete
from users.models import User
import uuid

class Match(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4(), editable=False)
    player1 = models.ForeignKey(User, related_name='Matches', on_delete=models.CASCADE)
    player2 = models.ForeignKey(User, related_name='Matches', on_delete=models.CASCADE)
    duration = models.IntegerField()
    winner = models.ForeignKey(User, related_name='wonMatches', on_delete=models.CASCADE)
    wScore = models.PositiveSmallIntegerField()
    lScore = models.PositiveSmallIntegerField()

    def __str__(self) -> str:
        return (f"{self.player1.username} - {self.player2.username}")

@receiver([post_save, post_delete], sender=Match)
def updateMatches(sender, instance, created=False, **kwargs):
    instance.player1.MatchesCount = instance.player1.Matches.count()
    instance.player2.MatchesCount = instance.player2.Matches.count()
    instance.player1.wonMatchesCount = instance.player1.wonMatches.count()
    instance.player2.wonMatchesCount = instance.player2.wonMatches.count()
    instance.player1.gameRatio = instance.player1.updateRatio()
    instance.player2.gameRatio = instance.player2.updateRatio()
    instance.player1.save()
    instance.player2.save()