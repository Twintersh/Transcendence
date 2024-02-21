import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
	private matchSocket: WebSocket = {} as WebSocket;
	public messages$: Subject<any> = new Subject<any>();

	private queueWebSocket$: WebSocket = {} as WebSocket;
	readonly queueMessages$: Subject<any> = new Subject<any>();

	private chatSocket: WebSocket = {} as WebSocket;
	public chatMessages$: Subject<any> = new Subject<any>();
	
	constructor(
		private readonly cookieService: CookieService
	) { }
	
	connectQueue(token: string): void {
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

		this.queueWebSocket$.onclose = (event) => {
			console.log('WebSocket connection closed:', event);
		}
	}

	disconnectQueue() {
		this.queueWebSocket$.close();
	}

	connect(url: string): void {
		this.matchSocket = new WebSocket(url);

		this.matchSocket.onopen = () => {
			console.log('WebSocket connection established.');
		}

		this.matchSocket.onclose = (event) => {
			console.log('WebSocket connection closed:', event);
		};

		this.matchSocket.onerror = (error) => {
			console.error('WebSocket error:', error);
		};

		this.matchSocket.onmessage = (event) => {
			this.messages$.next(JSON.parse(event.data));
		}
	}

	connectChat(roomId: string): void {
		const token = this.cookieService.get('authToken');

		this.chatSocket = new WebSocket('ws://' + "127.0.0.1:8000" +'/ws/chat/' + roomId + '/?token=' + token);
		console.log('connecting to chat');
		console.log(this.chatSocket);

		this.chatSocket.onopen = () => {
			this.chatMessages$.next({
				'message' : 'connected to room'
			});
			this.chatSocket.send(JSON.stringify({
				'message' : 'join'
			}));
			console.log('WebSocket connection established.');
		}

		this.chatSocket.onmessage = (event) => {
			this.chatMessages$.next(JSON.parse(event.data));
		}

		this.chatSocket.onclose = (event) => {
			console.log('WebSocket connection closed:', event);
		}
	}

	send(message: any) {
		// Send data to the server
		this.matchSocket.send(message);
	}

	receive() {
		// Receive data from the server
		this.matchSocket.onmessage = (event) => {
			this.messages$.next(JSON.parse(event.data));
		};
	}

	close() {
		// Close the WebSocket connection
		this.matchSocket.close();
	}
}