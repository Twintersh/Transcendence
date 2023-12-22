import json
import logging
from time import sleep
from channels.generic.websocket import AsyncWebsocketConsumer, SyncConsumer

from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from .pong import PongEngine
from asgiref.sync import async_to_sync

logging.basicConfig(level=logging.INFO)
log = logging.getLogger(__name__)

class PlayerConsumer(AsyncWebsocketConsumer):
	authentication_classes = [SessionAuthentication, TokenAuthentication]
	permission_classes = [IsAuthenticated]

	async def connect(self):
		self.room_name = self.scope["url_route"]["kwargs"]["game"]
		self.room_group_name = "game_%s" % self.room_name
		self.user = self.scope["user"]
		await self.channel_layer.group_add(self.room_group_name, self.channel_name)
		await self.accept()
		await self.channel_layer.send(
			"game_consumer", {"type": "launch_engine", "group_name": self.room_group_name}
		)
		print(f"Connected in room : {str(self.room_name)}")

	async def disconnect(self, close_code):
		# Leave room group
		await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

	async def receive(self, text_data):
		content = json.loads(text_data)
		keyInput = content["message"]
		print(f"Received {str(content)}")
		log.info("%s" % keyInput)
		await self.channel_layer.send(
			"game_consumer", {"type": "player_inputs", "input": keyInput}
		)

	async def gameUpdates(self, event):
		input = event["input"]
		await self.send(text_data=json.dumps({"input": "sent: " + str(input)}))


class GameConsumer(SyncConsumer):
	def __init__(self, *args, **kwargs):
		log.info("GameConsumer init")
	
	def launch_engine(self, event):
		self.group_name = event["group_name"]
		self.engine = PongEngine(self.group_name)
		self.engine.start()

	def player_inputs(self, event):
		keyInput = event["input"]
		self.engine.setPlayerInputs(keyInput)
