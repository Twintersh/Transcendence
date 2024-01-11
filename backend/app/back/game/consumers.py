import json
from time import sleep
from channels.generic.websocket import AsyncWebsocketConsumer, SyncConsumer
from channels.db import database_sync_to_async
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from .pong import PongEngine
from asgiref.sync import async_to_sync, sync_to_async
from .models import Match


@database_sync_to_async
def getPlayerID(id, user):
	match = Match.objects.get(id=id)
	if user == match.player1:
		return 1
	elif user == match.player2:
		return 2
	return 0

class PlayerConsumer(AsyncWebsocketConsumer):
	authentication_classes = [SessionAuthentication, TokenAuthentication]
	permission_classes = [IsAuthenticated]

	async def connect(self):
		self.room_name = self.scope["url_route"]["kwargs"]["game"]
		self.room_group_name = "game_%s" % self.room_name
		# self.playerID = await getPlayerID(self.room_name, self.scope["user"])
		self.playerID = 1
		if (self.playerID == 0):
			print("Could not connect user in room")
			await self.close()
		await self.channel_layer.group_add(self.room_group_name, self.channel_name)
		await self.accept()
		await self.channel_layer.send(
			"game_consumer", {"type": "launch", "group_name": self.room_group_name}	
		)
		print(f"Connected in room : {str(self.room_name)}")

	async def disconnect(self, close_code):
		# Leave room group
		await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

	async def receive(self, text_data):
		content = json.loads(text_data)
		keyInput = content["message"]
		
		await self.channel_layer.send(
			"game_consumer", {"type": "player_inputs", "playerID": self.playerID, "input" : keyInput}
		)

	async def gameUpdates(self, event):
		await self.send(text_data=json.dumps(
			{
				"paddle1Y": event["paddle1Y"],
				"paddle2Y": event["paddle2Y"],
				"ballX": event["ballX"],
				"ballY": event["ballY"],
			}))

class GameConsumer(SyncConsumer):
	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)
		self.nbConsumer = 0
		
	def launch(self, event):
		self.group_name = event["group_name"]
		self.nbConsumer += 1
		# print(f"{self.nbConsumer} consumers")
		if (self.nbConsumer == 2):
			self.engine = PongEngine(self.group_name)
			self.engine.start()

	def player_inputs(self, event):
		if self.nbConsumer < 2:
			print("Game hasn't started yet!")
			return
		playerID = event["playerID"]
		keyInput = event["input"]
		self.engine.setPlayerInputs(playerID, keyInput)
