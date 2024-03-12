import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable, Subject } from 'rxjs';

import { CookieService } from './cookie.service';
import { WebSocketService } from './websocket.service';

import { HTTP_MODE, IP_SERVER } from '../../env';

@Injectable({
  providedIn: 'root'
})
export class GameService {

	matchSocket: number = 0;
	lastMove: number = 0;
	input: number = 0;
	player: number = 0;
	localOpp: string = '';
	public gameEnded: boolean = false;
	private gameElements$: Subject<any> = new Subject<any>();
	readonly QueueMessages$: Subject<any> = new Subject<any>();

	constructor(
		private readonly http: HttpClient,
		private readonly cookieService: CookieService,
		private readonly router: Router,
		private readonly webSocketService: WebSocketService
	) { }

	getMatch(friend: string | null): void {
		this.webSocketService.connectQueue(friend);
		this.webSocketService.queueMessages$.subscribe((data) => {
			this.QueueMessages$.next(data);
		});
	}


	getLocalMatch(player1: string, player2: string): Observable<any> {
		const token = this.cookieService.getCookie('authToken');
		const headers = new HttpHeaders().set('Authorization', `Token ${token}`);

		const body = { "player1" : player1, "player2" : player2 };
		return this.http.post(HTTP_MODE + IP_SERVER + '/game/createMatch/', body, { headers });
	}

	launchMatch(match_id: string, local: boolean): void {
		this.gameEnded = false;
		this.webSocketService.connectMatch(match_id);
		
		this.webSocketService.messages$.subscribe((data) => {
			if (!this.gameEnded)
				this.gameElements$.next(data);
			else
				this.gameElements$.complete();
		});
		
		// Additional setup for keyboard events (optional)
		if (local) {
			document.addEventListener('keydown', this.sendInputsLocal.bind(this), false);
			document.addEventListener('keyup', this.sendInputsLocal.bind(this), false);
		}
		else {
			document.addEventListener('keydown', this.sendInputs.bind(this), false);
			document.addEventListener('keyup', this.sendInputs.bind(this), false);
		}
	}
		
	// Send keyboard inputs to the server
	private sendInputs(e: KeyboardEvent): void {
		if (this.gameEnded)
			return;
		if (e.type != 'keyup' && e.keyCode == this.lastMove)
			return;
		if (e.type == 'keyup')
			this.input = 0;
		else if (e.keyCode == 83)
			this.input = 1;
		else if (e.keyCode == 87)
			this.input = -1;
		// Send keyboard input to the server using WebSocketService
		this.webSocketService.send(JSON.stringify({
			'message': this.input})
		);
		if (e.type == 'keyup')
			this.lastMove = 0;
		else
			this.lastMove = e.keyCode;
	};

	private sendInputsLocal(e : KeyboardEvent): void {
		if (this.gameEnded)
			return;
		if (e.type != 'keyup' && e.keyCode == this.lastMove)
			return
		switch(e.keyCode)
		{
			case 83:
				this.input = 1;
				this.player = 1;
				break;
			case 87:
				this.input = -1;
				this.player = 1;
				break ;
			case 38 :
				this.input = -1;
				this.player = 2;
				break;
			case 40:
				this.input = 1;
				this.player = 2;
				break;
		}
		if (e.type == 'keyup')
			this.input = 0;
		this.webSocketService.send(JSON.stringify({
			'player' : this.player,
			'message': this.input,
		}));
		if (e.type == 'keyup')
			this.lastMove = 0
		else
			this.lastMove = e.keyCode
	};

	getQueueMessages(): Subject<any> {
		return this.QueueMessages$;
	}
	
	// Get an observable for game elements' positions
	getGameElements(): Subject<any> {
		return this.gameElements$;
	}

	getPlayers(matchId: string): Observable<any> {
		const token = this.cookieService.getCookie('authToken');
		const headers = new HttpHeaders().set('Authorization', `Token ${token}`);

		return this.http.get(HTTP_MODE + IP_SERVER + `/game/getPlayers/?id=${matchId}`, { headers });
	}

	disconnectQueue(): void {
		this.webSocketService.disconnectQueue();
	}

	endGame() {
		this.gameEnded = true;
		document.removeEventListener('keydown', this.sendInputsLocal.bind(this), false);
		document.removeEventListener('keyup', this.sendInputsLocal.bind(this), false);
		document.removeEventListener('keydown', this.sendInputs.bind(this), false);
		document.removeEventListener('keyup', this.sendInputs.bind(this), false);
		this.webSocketService.closeMatch();
	}
}
