import json
from django.conf import settings
from channels.generic.websocket import AsyncWebsocketConsumer, StopConsumer
from channels.db import database_sync_to_async
from asgiref.sync import sync_to_async
from .models import Match
from users.models import User
from django.shortcuts import get_object_or_404

from .processes import ProcessPool, QueuePool

@sync_to_async
def makeMatch(players):
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

# WebSocket consumer for managing the queue of players waiting for a match
class QueueManager(AsyncWebsocketConsumer):

	async def connect(self):
		self.room_group_name = "queue"
		if not self.scope['user'].is_authenticated:
			print("Unauthenticated")
			return
		await self.accept()
		await self.channel_layer.group_add(self.room_group_name, self.channel_name) #type:ignore

	async def disconnect(self, exit_code):
		await self.channel_layer.group_discard(self.room_group_name, self.channel_name) #type:ignore
		if self.scope['user'].is_authenticated:
			for player in settings.QUEUE_MANAGER:
				if player['user'] == self.scope['user'].username:
					settings.QUEUE_MANAGER.remove(player)
					break
		raise StopConsumer("Disconected")

	async def sendResponse(self, event):
		content = event['content']
		await self.send(text_data=json.dumps(content))

	async def receive(self, text_data):
		message = json.loads(text_data)["message"] 
		if message == "heartbeat":
			return
		if message == 'join':
			settings.QUEUE_MANAGER.append({
					'user' : self.scope["user"].username,
					'channel_name' : self.channel_name,
				})
		if len(settings.QUEUE_MANAGER) >= 2:
			players = []
			for i, player in enumerate(settings.QUEUE_MANAGER):
				if i < 2:
					players.append(player)
			response = await makeMatch(players)
			for player in players: 
				await self.channel_layer.send(player['channel_name'], {"type" : "sendResponse", "content" : response})

# Function to update the match details asynchronously
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

# Function to get the player ID for a match asynchronously
@database_sync_to_async
def getPlayerID(id, user):
	match = Match.objects.get(id=id)
	if not match:
		return -1
	if user == match.player1 and match.player1 == match.player2:
		return 3
	if user == match.player1:
		return 1
	elif user == match.player2:
		return 2
	return 0

# WebSocket consumer for managing the players in a match
class PlayerConsumer(AsyncWebsocketConsumer):
	def __init__(self, *args, **kwargs):
		self.process = None
		self.queue  = None
		super().__init__(*args, **kwargs)

	async def connect(self):
		self.room_name = self.scope["url_route"]["kwargs"]["game"]
		self.group_name = "game_%s" % self.room_name
		self.playerID = await getPlayerID(self.room_name, self.scope["user"])
		if (self.playerID == -1):
			raise StopConsumer("Invalid ID")
		if (self.playerID == 0):
			raise StopConsumer("Could not connect user in room")
		await self.channel_layer.group_add(self.group_name, self.channel_name)
		await self.accept()

		if not self.group_name in QueuePool.queues:
			QueuePool.new_queue(self) # create one queue for both players
	
		self.queue = QueuePool.queues[self.group_name]

		if not self.group_name in ProcessPool.processes:
			ProcessPool.new_process(self) # create one process for both players
	
		self.process = ProcessPool.processes[self.group_name]

		if self.playerID == 3:
			self.process['local'] = True
			self.process['paddle1'] = True
			self.process['paddle2'] = True
		elif self.playerID == 1:
			self.process['paddle1'] = True
		elif self.playerID == 2:
			self.process['paddle2'] = True

		if self.process['paddle1'] and self.process['paddle2']:
			self.process['process'].start() # starting process when both player are connected
			print("Running thread")
		print(f"Connected in room : {str(self.room_name)}")

	async def disconnect(self, close_code):
		if self.queue and self.process:
			self.queue.put('kill')
			self.process['process'].join()
		await self.channel_layer.group_discard(self.group_name, self.channel_name)
		raise StopConsumer("Disconnected")

	async def receive(self, text_data):
		content = json.loads(text_data)
		dir = content["message"]
		if self.process and self.process['local']:
			player = content["player"]
			self.queue.put([player, int(dir)]) # filling queue with incoming inputs
		else:
			self.queue.put([self.playerID, int(dir)]) # filling queue with incoming inputs


	async def sendUpdates(self, event):
		state = event['content']
		await self.send(json.dumps(state))

	async def endGame(self, event):
		content = event['content']
		if self.process:
			self.process['process'].join() # waiting for the process to end before continuing
		if self.playerID == 1 or self.playerID == 3:
			# Update the match details in the database
			await updateMatch(self.room_name, content) # update match info in db
		await self.close()

