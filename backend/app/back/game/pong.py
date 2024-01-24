import threading
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from time import sleep, time
from math import sin, radians, floor, ceil
import random
import json
import numpy as np

channel_layer = get_channel_layer()
tick_rate = 1/50

WIDTH = 640
HEIGHT = 480
MAX_ANGLE = 55 # default value : 55

paddleHeight=100 # default value: 100
paddleWidth=15 # default value: 15
paddleSpeed=10 # default value: 10

ballSize=21 # default value: 21
ballSpeed=12 # default value: 5
ballMaxSpeed=7 # default value: 7

pointsToWin=5 # default value: 5

# clock = pygame.time.Clock()
FPS=60

def roundNb(nb):
	if (nb - floor(nb) >= 0.5):
		return (ceil(nb))
	return (floor(nb))
class Ball:
	def __init__(self, posX, posY, size, speed):
		self.posx = posX
		self.posy = posY
		self.size = size
		self.speedX = speed/2
		self.speedY = 0.01
		self.speed = speed
	
	def move(self, score):
		if (self.posx >= WIDTH or self.posx <= 0):
			if (self.posx >= WIDTH):
				score[0] += 1
			else:
				score[1] += 1 
			self.posx = WIDTH / 2
			self.speedY = 0.1
			self.speedX = np.sign(self.speedX) * -self.speed/3
			self.posy = HEIGHT / 2
		if (self.posy >= HEIGHT - ballSize/2 or self.posy <= ballSize/2):
			self.speedY *= -1
		self.posx += self.speedX
		self.posy += self.speedY

	def hit(self, paddle):
		hitPoint = self.posy - (paddle.posy + paddle.height/2)
		angle = (2 * MAX_ANGLE * hitPoint) / paddle.height
		if (angle == 0):
			angle = 0.1

		self.speedY = self.speed * sin(radians(angle))
		self.speedX = np.sign(self.speedX) * -self.speed

		if (self.posx >= WIDTH/2):
			self.posx = paddle.posx - self.size/2 - 1
		else:
			self.posx = paddle.posx + self.size/2 + paddle.width - 1

class Stricker:
	def __init__(self, posX, posY, width, height, speed):
		self.posx = posX
		self.posy = posY - height/2
		self.width = width
		self.height = height
		self.speed = speed

	def check(self):
		if (self.posy < 0):
			self.posy = 0
		if (self.posy + self.height > HEIGHT):
			self.posy = HEIGHT-self.height

class PongEngine(threading.Thread):
	def __init__(self, groupe_name, **kwargs):
		super(PongEngine, self).__init__(daemon=True, name="PongEngine", **kwargs)
		self.websocket1 = None
		self.websocket2 = None
		self.nbPlayers = 0
		self.group_name = groupe_name
		self.channel_layer = get_channel_layer()
		self.inputLock = threading.Lock()
		self.input = [0, 0]
		self.playerReady = [False, False]

		self.paddle1 = Stricker(10, HEIGHT/2, paddleWidth, paddleHeight, paddleSpeed)
		self.paddle2 = Stricker(WIDTH - paddleWidth - 10, HEIGHT/2, paddleWidth, paddleHeight, paddleSpeed)
		self.ball = Ball(WIDTH/2, HEIGHT/2 - paddleHeight/2, ballSize, ballSpeed)

	def setWebsocket1(self, websocket):
		self.websocket1 = websocket
		self.nbPlayers += 1

	def setWebsocket2(self, websocket):
		self.websocket2 = websocket
		self.nbPlayers += 1

	def ready(self):
		if (self.nbPlayers == 2):
			return (True)
		return (False)

	def collide(self, circle, paddle):
		delta = circle.size/2
		if (circle.posx + delta >= paddle.posx and circle.posx - delta <= paddle.posx  + paddle.width):
			if (circle.posy + delta >= paddle.posy and circle.posy - delta <= paddle.posy + paddle.height):
				return (True)
		return (False)


	def run(self):
		print("Started engine loop...")
		start = time()
		self.score = [0, 0]
		self.running = True
		inputs = [0, 0]
		move = [0, 0]

		while True:
			if (self.playerReady[0] and self.playerReady[1]):
				break
			sleep(0.1)

		gameStart = time()
		while (self.running):
			if time() - start > tick_rate:
				with self.inputLock:
					inputs = self.input.copy()

				for i in range(2):
					if (inputs[i] == 87):
						move[i] = -1
					elif (inputs[i] == 83):
						move[i] = 1
					else:
						move[i] = 0

				self.paddle1.posy += move[0] * self.paddle1.speed
				self.paddle2.posy += move[1] * self.paddle2.speed

				if self.collide(self.ball, self.paddle2):
					self.ball.hit(self.paddle2)
				if self.collide(self.ball, self.paddle1):
					self.ball.hit(self.paddle1)

				self.paddle1.check()
				self.paddle2.check()
				self.ball.move(self.score)

				# if (self.score[0] >= pointsToWin or self.score[1] >= pointsToWin):
				# 	self.running = False

				self.sendUpdates()
				start = time()

		duration = time() - gameStart
		self.sendEndGame(duration)
		return (self.score)
	
	def sendEndGame(self, duration):
		if self.score[0] > self.score[1]:
			content = {
				'winner' : 'P1',
				'duration' : roundNb(duration),
				'wScore' : self.score[0],
				'lScore' : self.score[1]
			}
		else:
			content = {
				'winner' : 'P2',
				'duration' : roundNb(duration),
				'wScore' : self.score[1],
				'lScore' : self.score[0]
			}
		async_to_sync(self.websocket1.channel_layer.group_send)(self.group_name, {'type' : 'endGame', 'content' : content})
		

	def sendUpdates(self):
			async_to_sync(self.websocket1.send)(text_data=json.dumps({
				"paddle1Y": self.paddle1.posy,
				"paddle2Y": self.paddle2.posy,
				"ballX": self.ball.posx,
				"ballY": self.ball.posy,
				"Score": self.score
			}))
			async_to_sync(self.websocket2.send)(text_data=json.dumps({
				"paddle1Y": self.paddle1.posy,
				"paddle2Y": self.paddle2.posy,
				"ballX": self.ball.posx,
				"ballY": self.ball.posy,
				"Score": self.score
			}))

	def setPlayerInputs(self, player, keyinput):
		with self.inputLock:
			self.input[player - 1] = keyinput
			if (keyinput == 32):
				self.playerReady[player - 1] = True

