import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements AfterViewInit {
	@ViewChild('pongCanvas', { static: true }) pongCanvas!: ElementRef<HTMLCanvasElement>;
	@ViewChild('background', { static: true }) background!: ElementRef<HTMLImageElement>;
	@ViewChild('paddleLeft', { static: true }) paddleL!: ElementRef<HTMLImageElement>;
	@ViewChild('paddleRight', { static: true }) paddleR!: ElementRef<HTMLImageElement>;
	@ViewChild('gameBall', { static: true }) gameBall!: ElementRef<HTMLImageElement>;

	ngAfterViewInit() {
		this.gameloop();
	}

	gameloop() {
		console.log("gameloop");
		
		const canvas: HTMLCanvasElement = this.pongCanvas.nativeElement;
		const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');

		const background: HTMLImageElement = this.background.nativeElement;
		const paddleL: HTMLImageElement = this.paddleL.nativeElement;
		const paddleR: HTMLImageElement = this.paddleR.nativeElement;
		const gameBall: HTMLImageElement = this.gameBall.nativeElement;

		if (ctx === null) {
			console.log("ctx is null");
			return;
		}

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = "#53A6AC";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		background.onload = function() {
			ctx.drawImage(background, 0, 0);
		}
		paddleL.onload = function() {
			ctx.drawImage(paddleL, -10, 200, 75, 75);
		}
		paddleR.onload = function() {
			ctx.drawImage(paddleR, 575, 200, 75, 75);
		}
	}

	matchSocket: number = 0;
/*
	function getMatch(token) {
		const queueSocket = new WebSocket('ws://' + window.location.host +'/ws/game/queue/' + '?token=' + token);
		
		queueSocket.onopen = function(e) {
			queueSocket.send(JSON.stringify({
				'message': 'join',
			}));
		};

		queueSocket.onmessage = function(e) {
			const data = JSON.parse(e.data);
			console.log(data.response);
			if (data.response == 'match_found') {
				console.log('match found');
				launchMatch(data.match_id, token);
				queueSocket.close();
			}
		};	
	}

	function launchMatch(match_id, token) {
		const matchSocket = new WebSocket(
			'ws://'
			+ window.location.host
			+ '/ws/game/'
			+ match_id
			+ '/?token='
			+ token
			);
			
		matchSocket.onopen = function(e) {
			document.addEventListener('keydown', sendInputs, false);
			document.addEventListener('keyup', sendInputs, false);
			console.log('matchSocket open');
		};

		matchSocket.onmessage = function(e) {
			const data = JSON.parse(e.data);
			var paddle1 = document.getElementById("paddle1");
			var paddle2 = document.getElementById("paddle2");
			var ball = document.getElementById("ball");
			console.log("antilag");
			
			// ctx.fillRect(0, 0, canva.width, canva.height)

			// drawPaddle1(data.paddle1Y);
			// drawPaddle2(data.paddle2Y);
			// drawBall(data.ballX, data.ballY);

			paddle1.style.top = data.paddle1Y + 'px';
			paddle2.style.top = data.paddle2Y + 'px';
			ball.style.top = data.ballY + 'px';
			ball.style.left = data.ballX + 'px';
		};
		
		function sendInputs(e) {
			if (e.keyCode != 83 && e.keyCode != 87)
				return 
			input = e.keyCode;
			if (e.type == 'keyup')
				input = 0;
			console.log(input);
			matchSocket.send(JSON.stringify({
				'message': input,
			}));
		};
	}
*/
}
