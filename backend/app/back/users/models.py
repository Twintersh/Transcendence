from django.db import models
from django.contrib.auth.models import AbstractUser
from .managers import UserManager
from django.utils.translation import gettext as _

class User(AbstractUser):
    email = models.EmailField(_('email'), unique=True, blank=False, null=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return f"{self.username}"


class Match(models.Model):
    id = models.AutoField(primary_key=True)
    loser = models.ForeignKey('User', related_name='lostMatches', on_delete=models.CASCADE)
    winner = models.ForeignKey('User', related_name='wonMatches', on_delete=models.CASCADE)
    duration = models.IntegerField()
    wScore = models.PositiveSmallIntegerField()
    lScore = models.PositiveSmallIntegerField()

    def __str__(self):
        return f"{self.winner.username} - {self.loser.username}"
