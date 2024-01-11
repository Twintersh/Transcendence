from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from users.serializers import UserMatchSerializer
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import render
from .models import Match
from users.models import User

def index(request):
    return render(request, "game/index.html")

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
