import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { WebSocketService } from './websocket.service';
import { CookieService } from './cookie.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

	constructor (
		private readonly http: HttpClient,
		private readonly webSocketService: WebSocketService,
		private readonly cookieService: CookieService
	) { }

	connectChat(roomId: string): void {
		this.webSocketService.connectChat(roomId);
	}

	getRoomName(username: string) : any {
		const token = this.cookieService.getCookie('authToken');
		const headers = new HttpHeaders().set('Authorization', `Token ${token}`);

		const body = { "username" : username };

		return this.http.post('http://127.0.0.1:8000/chat/getRoomName/', body, { headers });
	}
}
