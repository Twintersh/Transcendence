import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { WebSocketService } from './websocket.service';
import { CookieService } from './cookie.service';

import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

	private messages$: Subject<any> = new Subject<any>();

	constructor (
		private readonly http: HttpClient,
		private readonly webSocketService: WebSocketService,
		private readonly cookieService: CookieService
	) { }

	// passer en observable sur un tableau de messages, c'est mieux
	ngOnInit(): void {
		this.webSocketService.chatMessages$.subscribe((message: any) => {
			this.messages$.next(message);
		});
	}

	connectChat(roomId: string): void {
		this.webSocketService.connectChat(roomId);
	}

	getRoomName(username: string) : any {
		const token = this.cookieService.getCookie('authToken');
		const headers = new HttpHeaders().set('Authorization', `Token ${token}`);

		const body = { "username" : username };

		return this.http.post('http://127.0.0.1:8000/chat/getRoomName/', body, { headers });
	}

	sendMessage(message: string): void {
		this.webSocketService.sendChatMessage(JSON.stringify({
			'message' : message
		}));
	}

	getMessages(): Subject<any> {
		return this.messages$;
	}
}
