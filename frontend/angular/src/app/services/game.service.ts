import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from './cookie.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GameService {

	matchSocket: number = 0;

	constructor(private readonly http: HttpClient, private readonly cookieService: CookieService, private readonly router: Router) {

	}

	getMatch(token: string) {
		//debugger;
		console.log('getMatch');
		const url: string = 'ws://' + "127.0.0.1:8000" +'/ws/game/queue/' + '?token=' + token;
		console.log(url);
		const queueSocket = new WebSocket(url);
		console.log(queueSocket);

		queueSocket.onopen = function(e) {
			console.log('queueSocket open');
			queueSocket.send(JSON.stringify({
				'message': 'join',
			}));
		};

		queueSocket.onclose = function(e) {
			console.log('queueSocket close');
		}

		queueSocket.onmessage = (e) => {
			console.log('queueSocket message');
			console.log(e.data);
			const data = JSON.parse(e.data);
			console.log(data.response);
			if (data.response == 'match_found') {
				console.log('match found');
				this.router.navigate(['/game/', data.match_id.toString()]);
				this.launchMatch(data.match_id, token);
				queueSocket.close();
			}
		};
	}

	launchMatch(match_id: number, token: string) {
		const matchSocket = new WebSocket(
			'ws://'
			+ "localhost:8000"
			+ '/ws/game/'
			+ match_id
			+ '/?token='
			+ token
		);
			
		matchSocket.onopen = function(e) {
		//	document.addEventListener('keydown', sendInputs, false);
		//	document.addEventListener('keyup', sendInputs, false);
			console.log('matchSocket open');
		};

		matchSocket.onmessage = function(e) {
			const data = JSON.parse(e.data);
			console.log("antilag");
			/*
			paddle1.style.top = data.paddle1Y + 'px';
			paddle2.style.top = data.paddle2Y + 'px';
			ball.style.top = data.ballY + 'px';
			ball.style.left = data.ballX + 'px';
			*/
		};
		/*
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
		*/
	}
}
