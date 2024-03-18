from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from drf_yasg.utils import swagger_auto_schema
from rest_framework.response import Response
from rest_framework import status

from .models import Room, Message
from users.models import User
from django.shortcuts import get_object_or_404

from users.serializers import UserLookSerializer

@swagger_auto_schema(method='post', request_body=UserLookSerializer)
@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def getRoomName(request):
	user = request.user
	serializer = UserLookSerializer(data=request.data)
	serializer.is_valid(raise_exception=True)
	toUser = get_object_or_404(User, username=serializer.data['username'])
	if user.blocked.filter(id=toUser.id).exists():
		return Response({"User blocked"}, status=status.HTTP_401_UNAUTHORIZED)
	if toUser.blocked.filter(id=user.id).exists():
		return Response({"Blocked by user"}, status=status.HTTP_401_UNAUTHORIZED)
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

@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def removeInvites(request):
	room_id = request.data['id']
	room = get_object_or_404(Room, id=room_id)
	Message.objects.filter(content__icontains="/invite").delete()
	Message.objects.filter(content__icontains="/accept").delete()
	return Response("Message deleted successfully", status=status.HTTP_200_OK)
