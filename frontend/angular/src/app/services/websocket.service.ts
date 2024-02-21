import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
	private socket: WebSocket = {} as WebSocket;
	public messages$: Subject<any> = new Subject<any>();

	private queueWebSocket$: WebSocket = {} as WebSocket;
	readonly queueMessages$: Subject<any> = new Subject<any>();
	
	constructor() {
	}
	
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
		this.socket = new WebSocket(url);

		this.socket.onopen = () => {
			console.log('WebSocket connection established.');
		}

		this.socket.onclose = (event) => {
			console.log('WebSocket connection closed:', event);
		};

		this.socket.onerror = (error) => {
			console.error('WebSocket error:', error);
		};

		this.socket.onmessage = (event) => {
			this.messages$.next(JSON.parse(event.data));
		}
	}

	connectChat(username: string): void {
		this.socket = new WebSocket('ws://' + "127.0.0.1:8000" +'/ws/game/queue/' + '?token=' + username);
	}

	send(message: any) {
		// Send data to the server
		this.socket.send(message);
	}

	receive() {
		// Receive data from the server
		this.socket.onmessage = (event) => {
			this.messages$.next(JSON.parse(event.data));
		};
	}

	close() {
		// Close the WebSocket connection
		this.socket.close();
	}
}