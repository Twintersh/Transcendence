import threading
from channels.generic.websocket import AsyncWebsocketConsumer, SyncConsumer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync, sync_to_async
from .models import Match, Tournament
from django.shortcuts import get_object_or_404
from time import sleep

from .consumers import makeMatch

class TournamentEngine(threading.Thread):
	def __init__(self, players, channel_layer, tournament_id):
		super(TournamentEngine, self).__init__(daemon=True, name="Tournament")
		self.tournament = get_object_or_404(Tournament, id=tournament_id)
		self.players = players
		self.channel_layer = channel_layer
		self.playersLock = threading.Lock()

	async def callMakeMatch(self, matchMembers):
		return (await makeMatch(matchMembers))

	def run(self):
		with self.playersLock:
			tmpPlayers = self.players
		# for each player in the list of players
		while len(tmpPlayers) != 0 :
			nextMatchMembers = []
			# make pairs of players and start the match
			for player in tmpPlayers:
				nextMatchMembers.append(player)
				if len(nextMatchMembers) == 2:
					match_id = async_to_sync(makeMatch)(nextMatchMembers)
					# send the match id to the players
					for member in nextMatchMembers:
						async_to_sync(self.channel_layer.send)(member["channel_name"],
							{ "type": "get_match_id", "match_id": match_id }
						)
					break
				tmpPlayers.remove(player)

	async def getLoosers(self):
		# remove the loosers from the list of players
		# could be improved
		initial = len(self.players)
		while (True):
			loosers = self.tournament.loosers.all()
			with self.playersLock:
				for looser in loosers:
					for player in self.players:
						if player["user"] == looser.username:
							self.players.remove(player)
				if len(self.players < initial) and ((len(self.players) & (len(self.players) - 1)) == 0):
					self.run()
			sleep(3)
