from rest_framework.decorators import api_view, authentication_classes, permission_classes, parser_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FileUploadParser
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import update_last_login

from .models import User, Match, FriendRequest, Avatar
from django.shortcuts import get_object_or_404
from rest_framework.authtoken.models import Token

from .serializers import *


# USER BASIC

@api_view(['POST'])
def signup(request):
    serializer = UserRegisterSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
        serializer.save()
        user = get_object_or_404(User, email=request.data['email'])
        user.set_password(request.data['password'])
        user.save()
        token = Token.objects.create(user=user)
        return Response({'token': token.key}, status=status.HTTP_200_OK)

@api_view(['POST'])
def login(request):
    serializer = UserLoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = get_object_or_404(User, email=serializer.data['email'])
    if not user.check_password(request.data['password']):
        return Response("Wrong password", status=status.HTTP_400_BAD_REQUEST)
    token, created = Token.objects.get_or_create(user=user)
    update_last_login(User, user)
    return Response({'token': token.key}, status=status.HTTP_200_OK)

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def logout(request):
    request.user.auth_token.delete()
    return Response("User logged out", status=status.HTTP_200_OK)

@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def updateCredential(request):
    user = request.user
    serializer = UserUpdateSerializer(user, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response("Credentials updated", status=status.HTTP_200_OK)

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FileUploadParser])
def getUserInfo(request):
    user = request.user
    serializer = UserInfoSerializer(instance=user)
    if hasattr(user, 'avatar') and user.avatar:
        avatarSerializer = Avatarserializer(instance=user.avatar)
        data = [serializer.data, avatarSerializer.data]
    else:
        data = [serializer.data]
    return Response(data, status=status.HTTP_200_OK)

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


@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def sendFriendRequest(request):
    fromUser = request.user
    toUserSerializer = UserLookSerializer(data=request.data['toUser'])
    toUserSerializer.is_valid(raise_exception=True)
    toUser = get_object_or_404(User, username=toUserSerializer.data['username'])
    friendRequest, created = FriendRequest.objects.get_or_create(fromUser=fromUser, toUser=toUser)
    if created :
        return Response("Friend request sent", status=status.HTTP_201_CREATED)
    else:
        return Response("Friend request already sent", status=status.HTTP_304_NOT_MODIFIED)
    
@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def acceptFriendRequest(request):
    toUser = request.user
    fromUserSerializer = UserLookSerializer(data=request.data['fromUser'])
    if fromUserSerializer.is_valid(raise_exception=True):
        fromUser = get_object_or_404(User, username=fromUserSerializer.data['username'])
        friendRequest = get_object_or_404(FriendRequest, fromUser=fromUser, toUser=toUser)
        friendRequest.fromUser.friends.add(toUser)
        friendRequest.toUser.friends.add(fromUser)
        friendRequest.delete()
        return Response("Friends added succesfully", status=status.HTTP_200_OK)
    

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def getSentFriendRequests(request):
    user = request.user
    requests = user.sentRequests.all()
    friendRequestSerializer = FriendRequestSerializer(instance=requests, many=True)
    return Response(friendRequestSerializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def getReceivedFriendRequests(request):
    user = request.user
    requests = user.receivedRequests.all()
    friendRequestSerializer = FriendRequestSerializer(instance=requests, many=True)
    return Response(friendRequestSerializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def getUserFriends(request):
    user = request.user
    friends = user.friends.all()
    friendsSerializer = UserLookSerializer(instance=friends, many=True)
    return Response(friendsSerializer.data, status=status.HTTP_200_OK)



# MATCHES


@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def sendFriendRequest(request):
    fromUser = request.user
    toUserSerializer = UserLookSerializer(data=request.data['toUser'])
    if toUserSerializer.is_valid(raise_exception=True):
        toUser = get_object_or_404(User, username=toUserSerializer.data['username'])
        friendRequest, created = FriendRequest.objects.get_or_create(fromUser=fromUser, toUser=toUser)
    if created :
        return Response("Friend request sent", status=status.HTTP_201_CREATED)
    else:
        return Response("Friend request already sent", status=status.HTTP_304_NOT_MODIFIED)
    
@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def acceptFriendRequest(request):
    toUser = request.user
    fromUserSerializer = UserLookSerializer(data=request.data['fromUser'])
    if fromUserSerializer.is_valid(raise_exception=True):
        fromUser = get_object_or_404(User, username=fromUserSerializer.data['username'])
        friendRequest = get_object_or_404(FriendRequest, fromUser=fromUser, toUser=toUser)
        friendRequest.fromUser.friends.add(toUser)
        friendRequest.toUser.friends.add(fromUser)
        friendRequest.delete()
        return Response("Friends added succesfully", status=status.HTTP_200_OK)
    

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def getSentFriendRequests(request):
    user = request.user
    requests = user.sentRequests.all()
    friendRequestSerializer = FriendRequestSerializer(instance=requests, many=True)
    return Response(friendRequestSerializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def getReceivedFriendRequests(request):
    user = request.user
    requests = user.receivedRequests.all()
    friendRequestSerializer = FriendRequestSerializer(instance=requests, many=True)
    return Response(friendRequestSerializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def getUserFriends(request):
    user = request.user
    friends = user.friends.all()
    friendsSerializer = UserLookSerializer(instance=friends, many=True)
    return Response(friendsSerializer.data, status=status.HTTP_200_OK)



@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def getUserMatches(request):
    user = request.user
    wonMatches = user.wonMatches.all()
    lostMatches = user.lostMatches.all()
    wonMatchesSerializer = MatchSerializer(instance=wonMatches, many=True)
    lostMatchesSerializer = MatchSerializer(instance=lostMatches, many=True)
    serializerList = [wonMatchesSerializer.data, lostMatchesSerializer.data]
    return Response(serializerList, status=status.HTTP_200_OK)

@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def createMatch(request):
    winnerSerializer = UserLookSerializer(data=request.data.get('winner', {}))
    loserSerializer = UserLookSerializer(data=request.data.get('loser', {}))
    matchSerializer = MatchSerializer(data=request.data)
    if winnerSerializer.is_valid(raise_exception=True):
        winner = get_object_or_404(User, username=winnerSerializer.data['username'])
        if loserSerializer.is_valid(raise_exception=True):
            loser = get_object_or_404(User, username=loserSerializer.data['username'])
            if matchSerializer.is_valid(raise_exception=True):
                matchSerializer.save(winner=winner, loser=loser)
                return Response("Match created and added to corresponding Users", status=status.HTTP_200_OK)
        
    