from rest_framework import serializers
from rest_framework.fields import empty
from .models import User, Match, FriendRequest, Avatar

class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {
            'password' : {'write_only':True}
        }

class UserLoginSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField()
    extra_kwargs = {
        'password' : {'write_only':True}
    }
    
class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = User
        fields = ['username', 'password']
        extra_kwargs = {
        'password' : {'write_only':True}
        }

    def update(self, instance, validated_data):
        instance.username = validated_data['username']
        password = validated_data['password']
        if password:
            instance.set_password(validated_data['password'])
        instance.save()
        return instance

class UserInfoSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = User
        fields = '__all__'

class UserLookSerializer(serializers.Serializer):
    username = serializers.CharField()

class Avatarserializer(serializers.ModelSerializer):
    class Meta(object):
        model = Avatar
        fields = ['image']

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
