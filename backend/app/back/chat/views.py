from django.shortcuts import render
from rest_framework.decorators import api_view, authentication_classes, permission_classes, parser_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FileUploadParser
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import update_last_login

# from .models import User, Match, FriendRequest, Avatar
from django.shortcuts import get_object_or_404
from rest_framework.authtoken.models import Token

from users.serializers import UserLookSerializer

def index(request):
    return render(request, "chat/index.html")

def room(request, room_name):
    return render(request, "chat/room.html", {"room_name": room_name})

