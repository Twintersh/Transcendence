import threading
from turtle import update
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from time import sleep, time
from math import sin, radians
import random

channel_layer = get_channel_layer()
tick_rate = 0.016 # 60 fps

WHITE = (255, 255, 255)
RED = (255, 0, 0)
HEIGHT = 480
WIDTH = 640
MAX_ANGLE = 55 # default value : 55

paddleHeight=HEIGHT # default value: 100
paddleWidth=10 # default value: 10
paddleSpeed=6 # default value: 10

ballRadius=7 # default value: 7
ballSpeed=3 # default value: 5
ballAcceleration=1.2 # default value: 1.2
ballMaxSpeed=7 # default value: 7

pointsToWin=5 # default value: 5

class Ball:
	def __init__(self, posX, posY, radius, speed, acce):
		self.posx = posX
		self.posy = posY
		self.radius = radius
		self.speedX = speed
		self.speedY = speed/2
		self.curSpeed = speed
		self.speed = speed
		self.acce = acce
	
	def move(self, paddles, score):
		if (self.posx >= WIDTH or self.posx <= 0):
			if (self.posx >= WIDTH):
				score[0] += 1
			else:
				score[1] += 1 
			self.posx = WIDTH / 2
			self.posy = random.randint(HEIGHT * 0.25, HEIGHT * 0.75)
			self.speedX = (abs(self.speedX)/self.speedX) * -self.speed # (abs(self.speedX/self.speedX)) to keep the current sign of speedX
			self.speedY = ((abs(self.speedY)/self.speedY) * self.speed) / 2
			self.curSpeed = self.speed
			paddles[0].height = paddleHeight
			paddles[1].height = paddleHeight
		if (self.posy >= HEIGHT or self.posy <= 0):
			self.speedY *= -1
		self.posx += self.speedX
		self.posy += self.speedY

	def hit(self, paddle):
		hitPoint = self.posy - (paddle.posy + paddle.height/2)
		angle = (2 * MAX_ANGLE * hitPoint) / paddle.height
		if (angle == 0):
			angle = 0.1

		if (abs(self.curSpeed) < ballMaxSpeed):
			self.curSpeed *= self.acce
		elif (abs(self.speed) >= ballMaxSpeed):
			self.curSpeed = (abs(self.curSpeed)/self.curSpeed) * -ballMaxSpeed

		self.speedY = self.curSpeed * sin(radians(angle))
		self.speedX = self.curSpeed

		if (self.posx >= WIDTH/2):
			self.speedX *= -1
			self.posx = paddle.posx - self.radius - 1
		else:
			self.posx = paddle.posx + self.radius + paddle.width - 1

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
		self.group_name = groupe_name
		self.channel_layer = get_channel_layer()
		self.inputLock = threading.Lock()
		self.input = [0, 0]
		# self.input = [0, 0]

		self.paddle1 = Stricker(10, HEIGHT/2, paddleWidth, paddleHeight, paddleSpeed)
		self.paddle2 = Stricker(WIDTH - paddleWidth - 10, HEIGHT/2, paddleWidth, paddleHeight, paddleSpeed)
		self.ball = Ball(WIDTH/2, HEIGHT/2, ballRadius, ballSpeed, ballAcceleration)

	def collide(self, circle, paddle):
		if (circle.posx + circle.radius >= paddle.posx and circle.posx - circle.radius <= paddle.posx  + paddle.width):
			if (circle.posy + circle.radius >= paddle.posy and circle.posy - circle.radius <= paddle.posy + paddle.height):
				return (True)
		return (False)


	def run(self):
		print("Started engine loop...")
		score = [0, 0]
		self.running = True
		inputs = [0, 0]
		move = [0, 0]
		# somme = 0
		# yo=0
	
		while (self.running):
			
			# start = time()
			# yo += 1

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
			self.paddle2.posy += move[0] * self.paddle2.speed

			if self.collide(self.ball, self.paddle1):
				self.ball.hit(self.paddle1)
			if self.collide(self.ball, self.paddle2):
				self.ball.hit(self.paddle2)


			self.paddle1.check()
			self.paddle2.check()
			self.ball.move([self.paddle1, self.paddle2], score)

			# if (score[0] >= pointsToWin or score[1] >= pointsToWin):
			# 	running = False

			self.sendUpdates()
			sleep(tick_rate)

			# end = time() - start
			# somme += end
			# moyenne = somme / yo
			# # if (end > moyenne * 1.5):
			# print("moyenne: ", moyenne)
			# print("caca: ", end)
		return (score)

	def sendUpdates(self):
			async_to_sync(self.channel_layer.group_send)(self.group_name, {
				"type": "gameUpdates",
				"paddle1Y": self.paddle1.posy,
				"paddle2Y": self.paddle2.posy,
				"ballX": self.ball.posx,
				"ballY": self.ball.posy,
			})

	def setPlayerInputs(self, player, keyinput):
		with self.inputLock:
			self.input[player - 1] = keyinput
