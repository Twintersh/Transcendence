import logging
import threading
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from time import sleep

logging.basicConfig(level=logging.INFO)
log = logging.getLogger(__name__)
channel_layer = get_channel_layer()

class PongEngine(threading.Thread):
	def __init__(self, groupe_name, **kwargs):
		super(PongEngine, self).__init__(daemon=True, name="PongEngine", **kwargs)
		self.group_name = groupe_name
		self.channel_layer = get_channel_layer()
		self.inputLock = threading.Lock()
		self.input = 0

	def run(self):
		print("Started engine loop...")
		while (True):
			sleep(1)
			self.sendUpdates()

	def sendUpdates(self):
		with self.inputLock:
			newInput = self.input
		print(newInput)
		async_to_sync(self.channel_layer.group_send)(self.group_name, {"type": "gameUpdates", "input": newInput})
		self.input = 0

	def setPlayerInputs(self, input : int):
		with self.inputLock:
			self.input = input
