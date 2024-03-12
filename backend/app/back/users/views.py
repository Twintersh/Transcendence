from rest_framework.decorators import api_view, authentication_classes, permission_classes, parser_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from drf_yasg.utils import swagger_auto_schema
from rest_framework.parsers import MultiPartParser, FileUploadParser
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import update_last_login
import requests as py_request
import json
import os
from django.http import JsonResponse

from .models import User, FriendRequest, Avatar
from game.models import Match
from django.shortcuts import get_object_or_404, redirect
from rest_framework.authtoken.models import Token

from .serializers import *
# USER BASIC

@swagger_auto_schema(method='POST', request_body=UserRegisterSerializer)
@api_view(['POST'])
def signup(request):
    serializer = UserRegisterSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
        serializer.save()
        user = get_object_or_404(User, email=request.data['email'])
        user.set_password(request.data['password'])
        Avatar.objects.create(user=user, image='media/avatars/default.jpg')
        user.save()
        token = Token.objects.create(user=user)
        return Response({'token': token.key}, status=status.HTTP_200_OK)

@api_view(['POST'])
def signup42(request):
	auth_code = request.query_params.get('code')

	client_id = os.environ.get('42_CLIENT_ID')
	client_secret = os.environ.get('42_SECRET_KEY')

	httpmode = str(os.environ.get('HTTP_MODE'))
	ipserv = str(os.environ.get('IP_SERVER'))
	uri = httpmode + ipserv + "/users/signup42/"

	token_url = 'https://api.intra.42.fr/oauth/token'
	data = {"grant_type" : "authorization_code",
			"client_id" : client_id,
			"client_secret" : client_secret,
			"code" : auth_code,
			"redirect_uri": uri
    } # to https://
	token_response = py_request.post(token_url, data=data)
	if token_response.status_code == 401:
		return Response(token_response, status=token_response.status_code)
	access_token = json.loads(token_response.content).get('access_token')
	user_reponse = py_request.get("https://api.intra.42.fr/v2/me", headers={"Authorization": f"Bearer {access_token}"})
	if user_reponse.status_code == 401:
		return Response(user_reponse.content, status=user_reponse.status_code)

	content = json.loads(user_reponse.content)
	username = content.get('login')
	avatar_link = content.get('image').get('link')
	email = content.get('email')
	try :
		user = User.objects.get(username=username)
		token, created = Token.objects.get_or_create(user=user)
		redirect_url = httpmode + ipserv + ':4200/?token=' + token.key
		return redirect(redirect_url)
	except User.DoesNotExist:
		user = User.objects.create(username=username, email=email, ft_auth=True)
		avatar = Avatar.objects.create(user=user, image=avatar_link)
		user.save()
		token = Token.objects.create(user=user)
		redirect_url = httpmode + ipserv + '4200/?token=' + token.key
		return redirect(redirect_url)

@swagger_auto_schema(method='POST', request_body=UserLoginSerializer)
@api_view(['POST'])
def login(request):
    serializer = UserLoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = get_object_or_404(User, email=serializer.data['email'])
    if user.ft_auth:
        return Response("This user is authenticated with 42", status=status.HTTP_400_BAD_REQUEST)
    if not user.check_password(request.data['password']):
        return Response("Wrong password", status=status.HTTP_400_BAD_REQUEST)
    token, created = Token.objects.get_or_create(user=user)
    user.is_active = True
    user.save()
    return Response({'token': token.key}, status=status.HTTP_200_OK)

@swagger_auto_schema(method='GET')
@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
def isAuth(request):
	if request.user.is_authenticated:
		return Response(True, status=status.HTTP_200_OK)
	else:
		return Response(False, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def logout(request):
    request.user.auth_token.delete()
    request.user.is_active = False
    request.user.save()
    return Response(True, status=status.HTTP_200_OK)

@swagger_auto_schema(method='POST', request_body=UserUpdateSerializer)
@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def updateCredential(request):
    user = request.user
    serializer = UserUpdateSerializer(user, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response("Credentials updated", status=status.HTTP_200_OK)

@swagger_auto_schema(method='GET')
@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FileUploadParser])
def getUserInfo(request):
    user = request.user
    serializer = UserInfoSerializer(instance=user)
    return Response(serializer.data, status=status.HTTP_200_OK)

@swagger_auto_schema(method='GET')
@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FileUploadParser])
def getUserInfoById(request):
	user_id = request.query_params.get('id')
	if not user_id:
		return Response("No user_ provided", status=status.HTTP_400_BAD_REQUEST)
	user = get_object_or_404(User, id=user_id)
	serializer = UserInfoSerializer(instance=user)
	return Response(serializer.data, status=status.HTTP_200_OK)

@swagger_auto_schema(method='GET')
@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FileUploadParser])
def getUserAvatar(request):
    user = request.user
    
    if hasattr(user, 'avatar') and user.avatar:
        image_serializer = Avatarserializer(instance=user.avatar)
        image_url = image_serializer.data['image']
        return Response({'avatar': image_url}, status=status.HTTP_200_OK)
    else:
        return Response({'detail': 'User has no avatar'}, status=status.HTTP_404_NOT_FOUND)


@swagger_auto_schema(method='POST')
@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FileUploadParser])
def uploadAvatar(request):
    user = request.user
    file = request.data['file']
    try:
        avatar = get_object_or_404(Avatar, user=user)
        avatar.image = file
        avatar.save()
        return Response("Avatar changed succesfully", status=status.HTTP_201_CREATED)
    except:
        avatar = Avatar(user=user, image=file)
        avatar.save()
        return Response("Avatar uploaded succesfully", status=status.HTTP_201_CREATED)

# FRIENDS REQUESTS

@swagger_auto_schema(method='POST', request_body=UserLookSerializer)
@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def sendFriendRequest(request):
    fromUser = request.user
    toUserSerializer = UserLookSerializer(data=request.data)
    print(request.data)
    toUserSerializer.is_valid(raise_exception=True)
    toUser = get_object_or_404(User, username=toUserSerializer.data['username'])
    if fromUser.friends.filter(id=toUser.id).exists():
         return Response("Cannot send friend request to friend", status=status.HTTP_406_NOT_ACCEPTABLE)
    if fromUser == toUser:
         return Response("Cannot send friend request to yourself", status=status.HTTP_406_NOT_ACCEPTABLE)
    friendRequest, created = FriendRequest.objects.get_or_create(fromUser=fromUser, toUser=toUser)
    if created :
        return Response("Friend request sent", status=status.HTTP_201_CREATED)
    else:
        return Response("Friend request already sent", status=status.HTTP_304_NOT_MODIFIED)
    

@swagger_auto_schema(method='POST', request_body=UserLookSerializer)
@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def acceptFriendRequest(request):
    toUser = request.user
    fromUserSerializer = UserLookSerializer(data=request.data)
    if fromUserSerializer.is_valid(raise_exception=True):
        fromUser = get_object_or_404(User, username=fromUserSerializer.data['username'])
        friendRequest = get_object_or_404(FriendRequest, fromUser=fromUser, toUser=toUser)
        friendRequest.fromUser.friends.add(toUser)
        friendRequest.toUser.friends.add(fromUser)
        friendRequest.delete()
        return Response("Friends added succesfully", status=status.HTTP_200_OK)


@swagger_auto_schema(method='GET')
@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def getSentFriendRequests(request):
    user = request.user
    requests = user.sentRequests.all()
    friendRequestSerializer = FriendRequestSerializer(instance=requests, many=True)
    return Response(friendRequestSerializer.data, status=status.HTTP_200_OK)


@swagger_auto_schema(method='GET')
@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def getReceivedFriendRequests(request):
    user = request.user
    requests = user.receivedRequests.all()
    friendRequestSerializer = FriendRequestSerializer(instance=requests, many=True)
    return Response(friendRequestSerializer.data, status=status.HTTP_200_OK)


@swagger_auto_schema(method='GET')
@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def getUserFriends(request):
    user = request.user
    friends = user.friends.all()
    friendsSerializer = UserInfoSerializer(instance=friends, many=True)
    return Response(friendsSerializer.data, status=status.HTTP_200_OK)



#   BLOCKED

@swagger_auto_schema(method='POST')
@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def unBlockUser(request):
    user = request.user
    toBlockSerializer = UserLookSerializer(data=request.data)
    toBlockSerializer.is_valid(raise_exception=True)
    toBlock = get_object_or_404(User, username=toBlockSerializer.data['username'])
    user.blocked.remove(toBlock)
    return Response("User unblocked succesfully", status=status.HTTP_200_OK)

@swagger_auto_schema(method='POST')
@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def blockUser(request):
    user = request.user
    toBlockSerializer = UserLookSerializer(data=request.data)
    toBlockSerializer.is_valid(raise_exception=True)
    toBlock = get_object_or_404(User, username=toBlockSerializer.data['username'])
    if toBlock == user:
        return Response("Cannot block yourself", status=status.HTTP_406_NOT_ACCEPTABLE)
    if user.blocked.filter(id=toBlock.id).exists():
        return Response("User already blocked",  status=status.HTTP_406_NOT_ACCEPTABLE)
    user.blocked.add(toBlock)
    return Response("User blocked succesfully", status=status.HTTP_200_OK)

@swagger_auto_schema(method='GET')
@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def getBlockedUsers(request):
     user = request.user
     users = user.blocked.all()
     serializer = UserLookSerializer(instance=users, many=True)
     return Response(serializer.data, status=status.HTTP_200_OK)

#   MATCHES
@swagger_auto_schema(method='GET')
@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def getUserMatches(request):
	id = request.query_params.get('id')
	if not id:
		return Response("No id provided", status=status.HTTP_400_BAD_REQUEST)
	user = get_object_or_404(User, id=id)
	user.p1Matches.filter(winner=None).delete()
	user.p2Matches.filter(winner=None).delete()
	Matches = user.p1Matches.all() | user.p2Matches.all()
	MatchesSerializer = MatchSerializer(instance=Matches, many=True)
	return Response(MatchesSerializer.data, status=status.HTTP_200_OK)

