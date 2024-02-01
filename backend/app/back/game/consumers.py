import json
from django.conf import settings
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from asgiref.sync import async_to_sync, sync_to_async
from .models import Match
from users.models import User
from django.shortcuts import get_object_or_404

from .processes import ProcessPool, QueuePool

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
			print("cheh")
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
			for i, player in enumerate(settings.QUEUE_MANAGER):
				print(player)
				if i < 2:
					players.append(player)
			response = await makeMatch(players)
			for player in players:
				await self.channel_layer.send(player['channel_name'], {"type" : "sendResponse", "content" : response})



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
	def __init__(self, *args, **kwargs):
		self.process = None
		self.queue  = None
		super().__init__(*args, **kwargs)

	async def connect(self):
		self.room_name = self.scope["url_route"]["kwargs"]["game"]
		self.group_name = "game_%s" % self.room_name
		self.playerID = await getPlayerID(self.room_name, self.scope["user"])
		if (self.playerID == 0):
			print("Could not connect user in room")
			await self.close()
		await self.channel_layer.group_add(self.group_name, self.channel_name)
		await self.accept()

		if not self.group_name in QueuePool.queues:
			QueuePool.new_queue(self)
	
		self.queue = QueuePool.queues[self.group_name]

		if not self.group_name in ProcessPool.processes:
			ProcessPool.new_thread(self)
	
		self.process = ProcessPool.processes[self.group_name]

		if self.playerID == 1:
			self.process['paddle1'] = True
		elif self.playerID == 2:
			self.process['paddle2'] = True


		if self.process['paddle1'] and self.process['paddle2']:
			self.process['process'].start()
			print("Running thread")
		print(f"Connected in room : {str(self.room_name)}")

	async def disconnect(self, close_code):
		self.queue.put('kill')
		self.process['process'].join()
		await self.channel_layer.group_discard(self.group_name, self.channel_name)

	async def receive(self, text_data):
		content = json.loads(text_data)
		dir = content["message"]
		self.queue.put([self.playerID, dir])


	async def sendUpdates(self, event):
		state = event['content']
		await self.send(json.dumps(state))

	async def endGame(self, event):
		content = event['content']
		self.process['process'].join()
		if self.playerID == 1:
			await updateMatch(self.room_name, content)
		await self.close()
	
