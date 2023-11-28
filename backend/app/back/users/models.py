from django.db import models
from django.contrib.auth.models import AbstractUser
from .managers import UserManager
from django.utils.translation import gettext as _

class User(AbstractUser):
    email = models.EmailField(_('email'), unique=True, blank=False, null=False)
    friends = models.ManyToManyField("User", blank=True)
    gameRatio = models.DecimalField(max_digits=2, decimal_places=1, default=0.0)
    winMatchesCount = models.IntegerField(default=0)
    lostMatchesCount = models.IntegerField(default=0)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return f"{self.username}"
    
    def save(self, *args, **kwargs):
        self.winMatchesCount = self.wonMatches.count()
        self.lostMatchesCount = self.lostMatches.count()
        self.updateRatio()
        super().save(*args, **kwargs)
    
    def updateRatio(self):
        if self.wonMatches.count() == 0:
            self.gameRatio = 0.0
        elif self.lostMatches.count() == 0:
            self.gameRatio = self.wonMatches.count()
        else:
            self.gameRatio = self.wonMatches.count() / self.lostMatches.count()

class FriendRequest(models.Model):
    fromUser = models.ForeignKey('User', related_name="sentRequests", on_delete=models.CASCADE)
    toUser = models.ForeignKey('User', related_name="receivedRequests", on_delete=models.CASCADE)

class Match(models.Model):
    id = models.AutoField(primary_key=True)
    loser = models.ForeignKey('User', related_name='lostMatches', on_delete=models.CASCADE)
    winner = models.ForeignKey('User', related_name='wonMatches', on_delete=models.CASCADE)
    duration = models.IntegerField()
    wScore = models.PositiveSmallIntegerField()
    lScore = models.PositiveSmallIntegerField()

    def __str__(self):
        return f"{self.winner.username} - {self.loser.username}"

