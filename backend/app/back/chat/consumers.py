# chat/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Message, Room, User
from channels.db import database_sync_to_async
# from . import send_chat_history

@database_sync_to_async
def save_message(room_name, content, sender):
	room = Room.objects.get(id=room_name)
	Message.objects.create(room=room, content=content, sender=sender)
	return

@database_sync_to_async
def get_history(room_name):
	history = []
	room = Room.objects.get(id=room_name)
	messages = Message.objects.filter(room=room).order_by('timestamp')
	for message in messages:
		history.append({'sender' : message.sender.username, 'content' : message.content})
	return history

class ChatConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
		self.room_group_name = "chat_%s" % self.room_name
		await self.channel_layer.group_add(self.room_group_name, self.channel_name)
		if not self.scope['user'].is_authenticated:
			return
		await self.accept()
		await self.send_chat_history()

	async def disconnect(self, close_code):
		await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

	async def receive(self, text_data):
		text_data_json = json.loads(text_data)
		content = text_data_json["message"]
		message = {'sender' : self.scope['user'].username, 'content' : content}
		await save_message(self.room_name, message['content'], self.scope['user']) 
		await self.channel_layer.group_send(self.room_group_name, {"type": "chat_message", "message": message})

	async def chat_message(self, event):
		message = event["message"]
		await self.send(text_data=json.dumps({"message": message}))

	async def send_chat_history(self):
		history = await get_history(self.room_name)
		await self.send(text_data=json.dumps(history))
		
