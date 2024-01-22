import json
from random import randint
from django.conf import settings
import threading
from channels.generic.websocket import AsyncWebsocketConsumer, SyncConsumer
from channels.db import database_sync_to_async
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from .pong import PongEngine
from asgiref.sync import async_to_sync, sync_to_async
from .models import Match
from users.models import User
from django.shortcuts import get_object_or_404


@sync_to_async
def makeMatch(players):
	print("Making match")
	player1 = User.objects.get(username=players[0]['user'])
	player2 = User.objects.get(username=players[1]['user'])
	newMatch = Match.objects.create(player1=player1, player2=player2)
	id = str(newMatch.id)
	print("Match instance created")
	if not newMatch:
		message = {'response' : 'error', 'match_id' : 0}
	else:
		message = {'response' : 'match_found', 'match_id' : id}
	return message
	


class QueueManager(AsyncWebsocketConsumer):

	async def connect(self):
		self.room_group_name = "queue"
		if not self.scope['user'].is_authenticated:
			return
		await self.accept()
		await self.channel_layer.group_add(self.room_group_name, self.channel_name)

	async def disconnect(self, exit_code):
		await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
		if self.scope['user'].is_authenticated:
			for player in settings.QUEUE_MANAGER:
				if player['user'] == self.scope['user'].username:
					settings.QUEUE_MANAGER.remove(player)
					break

	async def sendResponse(self, event):
		content = event['content']
		print(content)
		await self.send(text_data=json.dumps(content))

	async def receive(self, text_data):
		message = json.loads(text_data)["message"] 
		if message == 'join':
			settings.QUEUE_MANAGER.append({
					'user' : self.scope["user"].username,
					# 'flags' : flags,
					'channel_name' : self.channel_name,
				})
		if len(settings.QUEUE_MANAGER) >= 2:
			print("getting players")
			players = []
			tmp = str(randint(0, 10000))
			for i, player in enumerate(settings.QUEUE_MANAGER):
				print(player)
				if i < 2:
					await self.channel_layer.group_add(tmp, player['channel_name'])
					players.append(player)
			response = await makeMatch(players)
			await self.channel_layer.group_send(tmp, {'type' : 'sendResponse', 'content' : response})
			for player in players:
				print("removing player")
				await self.channel_layer.group_discard(tmp, player['channel_name'])



@database_sync_to_async
def updateMatch(id, content):
	curMatch = get_object_or_404(Match, id=id)
	curMatch.wScore = content['wScore']
	curMatch.lScore = content['lScore']
	curMatch.duration = content['duration']
	if content['winner'] == 'P1':
		curMatch.winner = curMatch.player1
	else:
		curMatch.winner = curMatch.player2
	curMatch.save()


@database_sync_to_async
def getPlayerID(id, user):
	match = Match.objects.get(id=id)
	if user == match.player1:
		return 1
	elif user == match.player2:
		return 2
	return 0

class PlayerConsumer(AsyncWebsocketConsumer):

	async def connect(self):
		self.room_name = self.scope["url_route"]["kwargs"]["game"]
		self.group_name = "game_%s" % self.room_name
		self.playerID = await getPlayerID(self.room_name, self.scope["user"])
		if (self.playerID == 0):
			print("Could not connect user in room")
			await self.close()
		await self.channel_layer.group_add(self.group_name, self.channel_name)
		await self.accept()

		if not self.group_name in settings.ENGINES:
			print(self.playerID)
			settings.ENGINES[self.group_name] = PongEngine(self.group_name)

		if self.playerID == 1:
			settings.ENGINES[self.group_name].setWebsocket1(self)
		elif self.playerID == 2:
			settings.ENGINES[self.group_name].setWebsocket2(self)

		if settings.ENGINES[self.group_name].ready():
			settings.ENGINES[self.group_name].start()
			print(f"Connected in room : {str(self.room_name)}")

	async def disconnect(self, close_code):
		await self.channel_layer.group_discard(self.group_name, self.channel_name)

	async def receive(self, text_data):
		content = json.loads(text_data)
		keyInput = content["message"]
		settings.ENGINES[self.group_name].setPlayerInputs(self.playerID, keyInput)

	async def endGame(self, event):
		content = event['content']
		if self.playerID == 1:
			await updateMatch(self.room_name, content)
		await self.close()
	
