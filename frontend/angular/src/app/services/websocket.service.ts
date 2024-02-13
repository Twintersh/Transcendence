import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
	private socket: WebSocket = {} as WebSocket;
	public messages$: Subject<any> = new Subject<any>();

	constructor() {
	}

	connect(url: string): void {
		this.socket = new WebSocket(url);

		this.socket.onopen = () => {
			console.log('WebSocket connection established.');
		};

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

	send(message: any) {
		// Send data to the server
		this.socket.send(JSON.stringify({
			'message' : message,
		}));
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