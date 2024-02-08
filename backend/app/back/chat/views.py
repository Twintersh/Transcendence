from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, authentication_classes, permission_classes, parser_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from drf_yasg.utils import swagger_auto_schema
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import update_last_login

from .models import Room, Message
from users.models import User
from django.shortcuts import get_object_or_404
from rest_framework.authtoken.models import Token

from users.serializers import UserLookSerializer

def index(request):
    return render(request, "chat/index.html")

def room(request, room_name):
    return render(request, "chat/room.html", {"room_name": room_name})

@csrf_exempt
@swagger_auto_schema(method='post', request_body=UserLookSerializer)
@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def getRoomName(request):
	user = request.user
	print(user.username)
	serializer = UserLookSerializer(data=request.data)
	serializer.is_valid(raise_exception=True)
	toUser = get_object_or_404(User, username=serializer.data['username'])
	print(toUser.username)
	try:
		room = Room.objects.filter(users=user).get(users=toUser)
		room_id = room.id
		return Response({'room_id': room_id}, status=status.HTTP_200_OK)
	except Room.DoesNotExist:
		pass	
	room = Room.objects.create()
	room.users.add(user, toUser)
	room.save()
	return Response({'room_id': room.id}, status=status.HTTP_200_OK)
