import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { WebSocketService } from './websocket.service';
import { CookieService } from './cookie.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
	constructor(
	private readonly http: HttpClient,
	private readonly webSocketService: WebSocketService,
	private readonly cookieService: CookieService
	) { }

	getRoomName() {
		const token = this.cookieService.getCookie('authToken');
		const headers = new HttpHeaders().set('Authorization', `Token ${token}`);

		const body = { "player1" : "benben", "player2" : "benben" };
		return this.http.post('http://127.0.0.1:8000/game/createMatch/', body, { headers });
	}
}
