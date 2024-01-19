import threading
from turtle import update
# import pygame
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from time import sleep, time
from math import sin, radians
import random
import json

channel_layer = get_channel_layer()
tick_rate = 1/50

WHITE = (255, 255, 255)
RED = (255, 0, 0)
HEIGHT = 480
WIDTH = 640
MAX_ANGLE = 55 # default value : 55

paddleHeight=100 # default value: 100
paddleWidth=15 # default value: 10
paddleSpeed=10 # default value: 10

ballSize=21 # default value: 7
ballSpeed=5 # default value: 5
ballAcceleration=1.2 # default value: 1.2
ballMaxSpeed=7 # default value: 7

pointsToWin=5 # default value: 5

# clock = pygame.time.Clock()
FPS=60

class Ball:
	def __init__(self, posX, posY, size, speed):
		self.posx = posX
		self.posy = posY
		self.size = size
		self.speedX = speed
		self.speedY = speed/2
		self.speed = speed
	
	def move(self, paddles, score):
		if (self.posx >= WIDTH or self.posx <= 0):
			if (self.posx >= WIDTH):
				score[0] += 1
			else:
				score[1] += 1 
			self.posx = WIDTH / 2
			self.posy = random.randint(HEIGHT * 0.25, HEIGHT * 0.75)
		if (self.posy >= HEIGHT - ballSize or self.posy <= 0):
			self.speedY *= -1
		self.posx += self.speedX
		self.posy += self.speedY

	def hit(self, paddle):
		hitPoint = self.posy - (paddle.posy + paddle.height/2)
		angle = (2 * MAX_ANGLE * hitPoint) / paddle.height
		if (angle == 0):
			angle = 0.1

		self.speedY = self.speed * sin(radians(angle))
		self.speedX = self.speed

		if (self.posx >= WIDTH/2):
			self.speedX *= -1
			self.posx = paddle.posx - self.size - 1
		else:
			self.posx = paddle.posx + paddle.width - 1

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

		self.paddle1 = Stricker(10, HEIGHT/2, paddleWidth, paddleHeight, paddleSpeed)
		self.paddle2 = Stricker(WIDTH - paddleWidth - 10, HEIGHT/2, paddleWidth, paddleHeight, paddleSpeed)
		self.ball = Ball(WIDTH/2, HEIGHT/2, ballSize, ballSpeed)

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
		space = 0
		# if (circle.posx >= WIDTH/2):
		# 	space = ballSize
		if (circle.posx + space >= paddle.posx and circle.posx - space <= paddle.posx  + paddle.width):
			if (circle.posy + space >= paddle.posy and circle.posy - space <= paddle.posy + paddle.height):
				self.sendUpdates()
				return (True)
		return (False)


	def run(self):
		self.start = time()
		print("Started engine loop...")
		score = [0, 0]
		self.running = True
		inputs = [0, 0]
		move = [0, 0]
	
		while (self.running):
			if time() - self.start > 0.016:
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
				self.ball.move([self.paddle1, self.paddle2], score)

				if (score[0] >= pointsToWin or score[1] >= pointsToWin):
					self.running = False

				self.sendUpdates()
				self.start = time()
		return (score)

	def sendUpdates(self):
			async_to_sync(self.websocket1.send)(text_data=json.dumps({
				"paddle1Y": self.paddle1.posy,
				"paddle2Y": self.paddle2.posy,
				"ballX": self.ball.posx,
				"ballY": self.ball.posy,
			}))
			async_to_sync(self.websocket2.send)(text_data=json.dumps({
				"paddle1Y": self.paddle1.posy,
				"paddle2Y": self.paddle2.posy,
				"ballX": self.ball.posx,
				"ballY": self.ball.posy,
			}))

			# async_to_sync(self.channel_layer.group_send)(self.group_name, {
			# 	"type": "gameUpdates",
			# })

	def setPlayerInputs(self, player, keyinput):
		with self.inputLock:
			self.input[player - 1] = keyinput
