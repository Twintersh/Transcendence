import { Component, Input } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { WebSocketService } from '../../../../services/websocket.service';

@Component({
  selector: 'app-queue-modal',
  templateUrl: './queue-modal.component.html',
  styleUrls: ['./queue-modal.component.scss'],
})
export class QueueModalComponent {

	@Input() opponentFound: boolean = false;
	@Input() status: string = 'Searching for opponent...';

	constructor(
		private readonly ngbModal: NgbModal,
		private readonly webSocketService: WebSocketService
	) { }

	leaveQueue() {
		this.webSocketService.disconnectQueue();
		this.ngbModal.dismissAll();
	}
}
