import { Injectable } from '@angular/core';

import { BehaviorSubject, Subject } from 'rxjs';

import { CookieService } from '../services/cookie.service';
import { Message } from '../models/chat.model';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
	private matchSocket: WebSocket = {} as WebSocket;
	public messages$: Subject<any> = new Subject<any>();

	private queueWebSocket$: WebSocket = {} as WebSocket;
	readonly queueMessages$: Subject<any> = new Subject<any>();

	private chatSocket: WebSocket = {} as WebSocket;
	private chatMessages: BehaviorSubject<Message[]> = new BehaviorSubject<Message[]>([]);
	public chatMessages$ = this.chatMessages.asObservable();
	
	constructor(
		private readonly cookieService: CookieService
	) { }
	
	connectQueue(): void {
		const token = this.cookieService.getCookie('authToken');
		this.queueWebSocket$ = new WebSocket('ws://' + "127.0.0.1:8000" +'/ws/game/queue/' + '?token=' + token);

		this.queueWebSocket$.onopen = () => {
			this.queueMessages$.next({
				'message' : 'connected to queue'
			});
			this.queueWebSocket$.send(JSON.stringify({
				'message' : 'join'
			}));
			console.log('WebSocket connection established.');
		}

		this.queueWebSocket$.onmessage = (event) => {
			this.queueMessages$.next(JSON.parse(event.data));
		}
	}

	disconnectQueue() {
		this.queueWebSocket$.close();
	}

	connectMatch(match_id: string): void {
		const token: string = this.cookieService.getCookie("authToken");
		const matchSocket: string = 'ws://127.0.0.1:8000/ws/game/' + match_id + '/?token=' + token;

		this.matchSocket = new WebSocket(matchSocket);

		this.matchSocket.onopen = () => {
			console.log('WebSocket connection established.');
		}

		this.matchSocket.onerror = (error) => {
			console.error('WebSocket error:', error);
		};

		this.matchSocket.onmessage = (event) => {
			this.messages$.next(JSON.parse(event.data));
		}
	}

	connectChat(roomId: string): void {
		const token = this.cookieService.getCookie('authToken');

		this.chatSocket = new WebSocket('ws://' + "127.0.0.1:8000" +'/ws/chat/' + roomId + '/?token=' + token);

		this.chatSocket.onopen = () => {
			console.log('Chat WebSocket connection established.');
		}

		this.chatSocket.onmessage = (event) => {
			const data: Message[] | {message: Message} = JSON.parse(event.data);
			if (data instanceof Array)
				this.chatMessages.next([...this.chatMessages.value, ...data])
			else
				this.chatMessages.next([...this.chatMessages.value, data.message])
		}

		this.chatSocket.onclose = () => {
			console.log('Chat WebSocket connection closed:');
		}
	}

	send(message: any) {
		// Send data to the server
		this.matchSocket.send(message);
	}

	sendChatMessage(message: any) {
		this.chatSocket.send(message);
	}

	receive() {
		// Receive data from the server
		this.matchSocket.onmessage = (event) => {
			this.messages$.next(JSON.parse(event.data));
		};
	}

	closeMatch() {
		// Close the match WebSocket connection
		this.matchSocket.close();
	}

	disconnectChat() {
		this.chatSocket.close();
	}
}