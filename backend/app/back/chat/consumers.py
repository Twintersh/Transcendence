# chat/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Message, Room
from channels.db import database_sync_to_async
# from . import send_chat_history

from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated


class ChatConsumer(AsyncWebsocketConsumer):

	async def connect(self):
		self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
		self.room_group_name = "chat_%s" % self.room_name
		await self.channel_layer.group_add(self.room_group_name, self.channel_name)
		if not self.scope['user'].is_authenticated:
			return
		await self.accept()
		await self.send_chat_history()

	@database_sync_to_async
	def save_message(self, room_name, content):
		return Message.objects.create(room_name=room_name, content=content)
	
	@database_sync_to_async
	def getHistory(self):
		room = Room.objects.get(id=self.room_name)
		history = Message.objects.filter(room=room).order_by('timestamp')[:10]
		return history

	async def disconnect(self, close_code):
		await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

	async def receive(self, text_data):
		text_data_json = json.loads(text_data)
		message = text_data_json["message"]

		await self.save_message(self.room_name, message)

		await self.channel_layer.group_send(
			self.room_group_name, {"type": "chat_message", "message": message}
		)

	async def chat_message(self, event):
		message = event["message"]
		await self.send(text_data=json.dumps({"message": message}))

	async def send_chat_history(self):
			history = await self.getHistory()
			async for message in history:
				await self.send(text_data=json.dumps({
					'message': message.content
				}))
