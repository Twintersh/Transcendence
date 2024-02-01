from multiprocessing import Process, Queue
from .pong import run

WIDTH = 640
HEIGHT = 480
ballSize = 21

class QueuePool():

	queues = {}

	@classmethod
	def new_queue(cls, instance):
		cls.queues[instance.group_name] = Queue()

class ProcessPool():

	processes = {}

	@classmethod
	def new_thread(cls, instance):
		cls.processes[instance.group_name] = {
			"process" : Process(target=run, args=(instance.queue, instance.group_name, )),
			"paddle1" : False,
			"paddle2" : False,
			"running" : False
		}
