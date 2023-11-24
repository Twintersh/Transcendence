from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import User, Match
from django.shortcuts import get_object_or_404
from rest_framework.authtoken.models import Token

from .serializers import UserSerializer, MatchSerializer, UserLookSerializer

@api_view(['POST'])
def signup(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        user = User.objects.get(email=request.data['email'])
        user.set_password(request.data['password'])
        user.save()
        token = Token.objects.create(user=user)
        return Response({'token': token.key, 'user': serializer.data}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login(request):
    user = get_object_or_404(User, email=request.data['email'])
    if not user.check_password(request.data['password']):
        return Response("Wrong password", status=status.HTTP_400_BAD_REQUEST)
    token, created = Token.objects.get_or_create(user=user)
    serializer = UserSerializer(user)
    return Response({'token': token.key, 'user': serializer.data}, status=status.HTTP_200_OK)

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def test_token(request):
    return Response("OK", status=status.HTTP_200_OK)

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
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        password = request.data['password']
        if password is not None:
            user = request.user
            user.set_password(password)
            user.save()
        return Response("Credentials updated", status=status.HTTP_200_OK)
    return Response("Invalid request", status=status.HTTP_400_BAD_REQUEST)

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
        
    