from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from time import time
from math import sin, radians, floor, ceil
import random
import asyncio

channel_layer = get_channel_layer()
tick_rate = 1/50

WIDTH = 640
HEIGHT = 480
MAX_ANGLE = 55 # default value : 55

paddleHeight=100 # default value: 100
paddleWidth=15 # default value: 15
paddleSpeed=4 # default value: 10

ballSize=21 # default value: 21
ballSpeed=2 # default value: 5
ballMaxSpeed=8 # default value: 7

pointsToWin=10 # default value: 5

def roundNb(nb):
	if (nb - floor(nb) >= 0.5):
		return (ceil(nb))
	return (floor(nb))

class Ball:
	def __init__(self, paddle1, paddle2):
		self.paddle1 = paddle1
		self.paddle2 = paddle2
		self.x = WIDTH / 2
		self.y = HEIGHT / 2 - paddleHeight / 2
		self.speedX = ballSpeed
		self.speedY = ballSpeed/2
		self.time = time()
	
	def hit(self, paddle):
		hitPoint = self.y - (paddle.y + paddleHeight/2)
		angle = (2 * MAX_ANGLE * hitPoint) / paddleHeight
		if (angle == 0):
			angle = 0.1

		self.speedY = ballSpeed * sin(radians(angle))
		self.speedX *= -1

		if (self.x >= WIDTH/2):
			self.x = paddle.x - ballSize/2 - 1
		else:
			self.x = paddle.x + ballSize/2 + paddleWidth + 1

	def collide(self, paddle):
		delta = ballSize / 2
		if (self.x + delta >= paddle.x and self.x - delta <= paddle.x + paddleWidth):
			if (self.y + delta >= paddle.y and self.y - delta <= paddle.y + paddleHeight):
				return (True)
		return (False)
	
	def move(self):
		if self.collide(self.paddle2):
			self.hit(self.paddle2)
		if self.collide(self.paddle1):
			self.hit(self.paddle1)

		if (self.x >= WIDTH or self.x <= 0):
			if (self.x >= WIDTH):
				self.paddle1.score += 1
			else:
				self.paddle2.score += 1
			self.x = WIDTH / 2
			self.y = random.randint(int(HEIGHT * 0.25), int(HEIGHT * 0.75))
		if (self.y >= HEIGHT - ballSize/2 or self.y <= ballSize/2):
			self.speedY *= -1
		self.x += self.speedX
		self.y += self.speedY


class Paddle:
	def __init__(self, player):
		if player == "p1":
			self.x = 10
		else:
			self.x = WIDTH - 10 - paddleWidth
		self.y = HEIGHT / 2 - paddleHeight / 2
		self.dir = 0
		self.score = 0

	def move(self):
		self.y += self.dir * paddleSpeed
		if (self.y < 0):
			self.y = 0
		elif (self.y + paddleHeight > HEIGHT):
			self.y = HEIGHT - paddleHeight

# exectued in a separated process (one per game)
# group_name to send updates through channel_layer **maybe try to go directly through websocket by having consummer instances passed to method
def run(queue, group_name):
	paddle1 = Paddle("p1")
	paddle2 = Paddle("p2")
	ball = Ball(paddle1, paddle2)
	loop = time()
	start = time()

	while True:
		if not asyncio.run(setInputs(queue, paddle1, paddle2)):
			break
			
		if time() - start > 0.005:	#move everything x times per second
			paddle1.move()
			paddle2.move()
			ball.move()
			start = time()

		if (paddle1.score >= pointsToWin or paddle2.score >= pointsToWin):
			state = {
				"paddle1" : {"x" : paddle1.x, "y" : paddle1.y, "score" : paddle1.score},
				"paddle2" : {"x" : paddle2.x, "y" : paddle2.y, "score" : paddle2.score},
				"ball" : {"x" : ball.x, "y" : ball.y}
			}
			async_to_sync(channel_layer.group_send)(group_name, {'type' : 'sendUpdates', 'content' : state})
			async_to_sync(channel_layer.group_send)(group_name, {'type' : 'sendWinner', 'content' : {'winner' : 'P1' if paddle1.score >= pointsToWin else 'P2', 'duration' : roundNb(time() - loop)}})
			break ;
		state = {
			"paddle1" : {"x" : paddle1.x, "y" : paddle1.y, "score" : paddle1.score},
			"paddle2" : {"x" : paddle2.x, "y" : paddle2.y, "score" : paddle2.score},
			"ball" : {"x" : ball.x, "y" : ball.y}
		}
		async_to_sync(channel_layer.group_send)(group_name, {'type' : 'sendUpdates', 'content' : state})	#send updates as much as possible to prevent lag
	duration = time() - loop
	sendEndGame([paddle1.score, paddle2.score], duration, group_name)

async def setInputs(queue, paddle1, paddle2):
	if not queue.empty():
		inputs = queue.get(False)
		if inputs[0] == 1:
			paddle1.dir = inputs[1]
		elif inputs[0] == 2:
			paddle2.dir = inputs[1]
		elif inputs == 'kill':
			return False
	return True

def sendEndGame(score, duration, group_name):
	if score[0] > score[1]:
		content = {
			'winner' : 'P1',
			'duration' : roundNb(duration),
			'wScore' : score[0],
			'lScore' : score[1]
		}
	else:
		content = {
			'winner' : 'P2',
			'duration' : roundNb(duration),
			'wScore' : score[1],
			'lScore' : score[0]
		}
	async_to_sync(channel_layer.group_send)(group_name, {'type' : 'endGame', 'content' : content})

