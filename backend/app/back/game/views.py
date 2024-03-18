from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from users.serializers import UserMatchSerializer, UserInfoSerializer
from rest_framework.parsers import MultiPartParser, FileUploadParser
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import render, get_object_or_404
from .models import Match
from users.models import User, Avatar
from users.serializers import Avatarserializer

def index(request):
    return render(request, "game/index.html")

@api_view(['GET'])
def getPlayers(request):
    match_id = request.query_params.get('id')
    print('match_id in getplayers is:')
    print(match_id)
    if not match_id:
        return Response("No match id provided", status=status.HTTP_400_BAD_REQUEST)
    match = get_object_or_404(Match, id=match_id)
    serializer = UserInfoSerializer(instance=match.player1)
    p1 = serializer.data
    serializer = UserInfoSerializer(instance=match.player2)
    p2 = serializer.data
    response = {"player1" : p1,
                "player2" : p2}
    return Response(response, status=status.HTTP_200_OK)

@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def createMatch(request):
    serializer = UserMatchSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    p1 = User.objects.get(username=serializer.data["player1"])
    p2 = User.objects.get(username=serializer.data["player2"])
    newMatch = Match.objects.create(player1=p1, player2=p2)
    if not newMatch:
        return Response("Could not create match, user not found", status=status.HTTP_400_BAD_REQUEST)
    return Response({"id" : newMatch.id}, status=status.HTTP_201_CREATED)
