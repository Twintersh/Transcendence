from rest_framework import serializers
from rest_framework.fields import empty
from .models import User, Match, FriendRequest

class UserSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = User
        fields = ['id', 'username', 'email', 'password']

class UserLookSerializer(serializers.Serializer):
    username = serializers.CharField()

class FriendRequestSerializer(serializers.ModelSerializer):
    fromUser = UserLookSerializer()
    toUser = UserLookSerializer()

    class Meta(object):
        model = FriendRequest
        fields = ['id', 'fromUser', 'toUser']

class MatchSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Match
        fields = ['id', 'duration', 'wScore', 'lScore']
