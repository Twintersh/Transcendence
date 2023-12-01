from collections.abc import Iterable
from django.db import models
from django.dispatch import receiver
from django.db.models.signals import post_save, post_delete
from django.contrib.auth.models import AbstractUser
from .managers import UserManager
from django.utils.translation import gettext as _

class User(AbstractUser):
    email = models.EmailField(_('email'), unique=True, blank=False, null=False)
    friends = models.ManyToManyField('User', blank=True)
    gameRatio = models.DecimalField(max_digits=2, decimal_places=1, default=0.0)
    wonMatchesCount = models.IntegerField(default=0)
    MatchesCount = models.IntegerField(default=0)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return f"{self.username}"
        
    def updateRatio(self):
        if self.MatchesCount == 0:
            return 0.0
        else:
            return self.wonMatchesCount / self.MatchesCount

class FriendRequest(models.Model):
    fromUser = models.ForeignKey('User', related_name="sentRequests", on_delete=models.CASCADE)
    toUser = models.ForeignKey('User', related_name="receivedRequests", on_delete=models.CASCADE)

class Avatar(models.Model):
    user = models.OneToOneField('User', related_name='avatar', on_delete=models.CASCADE, blank=True, null=True)
    image = models.FileField(upload_to='avatars', blank=True, default='default.jpg')

class Match(models.Model):
    id = models.AutoField(primary_key=True)
    loser = models.ForeignKey('User', related_name='lostMatches', on_delete=models.CASCADE)
    winner = models.ForeignKey('User', related_name='wonMatches', on_delete=models.CASCADE)
    duration = models.IntegerField()
    wScore = models.PositiveSmallIntegerField()
    lScore = models.PositiveSmallIntegerField()

    def __str__(self):
        return f"{self.winner.username} - {self.loser.username}"

@receiver([post_save, post_delete], sender=Match)
def updateMatches(sender, instance, created=False, **kwargs):
    instance.winner.MatchesCount = instance.winner.wonMatches.count() + instance.winner.lostMatches.count()
    instance.loser.MatchesCount = instance.loser.wonMatches.count() + instance.loser.lostMatches.count()
    instance.winner.wonMatchesCount = instance.winner.wonMatches.count()
    instance.loser.wonMatchesCount = instance.loser.wonMatches.count()
    instance.winner.gameRatio = instance.winner.updateRatio()
    instance.loser.gameRatio = instance.loser.updateRatio()
    instance.winner.save()
    instance.loser.save()



