import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from './cookie.service';
import { WebSocketService } from './websocket.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {

	matchSocket: number = 0; // inférence
	lastMove: number = 0;
	input: number = 0;
	player: number = 0;
	private gameElements$: Subject<any> = new Subject<any>();

	constructor(
		private readonly http: HttpClient,
		private readonly cookieService: CookieService,
		private readonly router: Router,
		private readonly webSocketService: WebSocketService
	) { }

	getMatch(token: string) {
		//debugger;
		console.log('getMatch');
		const url: string = 'ws://' + "127.0.0.1:8000" +'/ws/game/queue/' + '?token=' + token;
		const queueSocket = new WebSocket(url);

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
			const data = JSON.parse(e.data);
			console.log(data.response);
			if (data.response == 'match_found') {
				queueSocket.close();
				this.router.navigate(['/game/', data.match_id.toString()]);
				//this.launchMatch(data.match_id, token);
			}
		};
	}

	launchMatch(match_id: string) {
		const token: string = this.cookieService.getCookie("authToken");
		const matchSocket: string = 'ws://localhost:8000/ws/game/' + match_id + '/?token=' + token;

		const gameSocket = this.webSocketService.connect(matchSocket);
			
		this.webSocketService.messages$.subscribe((data) => {
			this.gameElements$.next(data);
		});
		
		// Additional setup for keyboard events (optional)
		document.addEventListener('keydown', this.sendInputs.bind(this), false);
		document.addEventListener('keyup', this.sendInputs.bind(this), false);
		console.log('WebSocket connection initiated');
	}
		
	// Send keyboard inputs to the server
	private sendInputs(e: KeyboardEvent): void {
		if (e.type != 'keyup' && e.keyCode == this.lastMove)
			return;
		if (e.type == 'keyup')
			this.input = 0;
		else if (e.keyCode == 83)
			this.input = 1;
		else if (e.keyCode == 87)
			this.input = -1;
		// Send keyboard input to the server using WebSocketService
		this.webSocketService.send(this.input);
		if (e.type == 'keyup')
			this.lastMove = 0;
		else
			this.lastMove = e.keyCode;
	};
	
	// Get an observable for game elements' positions
	getGameElements(): Subject<any> {
		return this.gameElements$;
	}

	getPlayers(matchId: string) {
		const token = this.cookieService.getCookie('authToken');
		const headers = new HttpHeaders().set('Authorization', `Token ${token}`)
			.set('id', matchId);


		return this.http.get<any>('http://127.0.0.1:8000/game/getPlayers/', { headers });
	}
}
