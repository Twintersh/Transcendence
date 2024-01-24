import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
	private queueSocket: WebSocket;

	constructor() {
		// Initialize the WebSocket connection
		this.queueSocket = new WebSocket('wss://' + window.location.host + '/ws/game/queue/');
		this.queueSocket.onopen = this.onOpen.bind(this);
		this.queueSocket.onmessage = this.onMessage.bind(this);
		this.queueSocket.onclose = this.onClose.bind(this);
		this.queueSocket.onerror = this.onError.bind(this);
	}

	private onOpen(event: Event) {
		// Handle the WebSocket connection opened
		console.log('WebSocket connection opened:', event);
	}

	private onMessage(event: MessageEvent) {
		// Handle incoming messages
		console.log('WebSocket message received:', event.data);
	}

	private onClose(event: CloseEvent) {
		// Handle the WebSocket connection closed
		console.log('WebSocket connection closed:', event);
	}

	private onError(event: Event) {
		// Handle WebSocket errors
		console.error('WebSocket error:', event);
	}
}