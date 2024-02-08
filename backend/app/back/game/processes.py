from multiprocessing import Process, Queue
from .pong import run

#static array of queues (one per game)
class QueuePool():

	queues = {}

	@classmethod
	def new_queue(cls, instance):
		cls.queues[instance.group_name] = Queue()

#static array of processes (one per game)
class ProcessPool():

	processes = {}

	@classmethod
	def new_process(cls, instance):
		cls.processes[instance.group_name] = {
			"process" : Process(target=run, args=(instance.queue, instance.group_name, )), # same as thread but in true parallel (bypassing GIL)
			"paddle1" : False,
			"paddle2" : False,
			"running" : False,
			"local" : False
		}
