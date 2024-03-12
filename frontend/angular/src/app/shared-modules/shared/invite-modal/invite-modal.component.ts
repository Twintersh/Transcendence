import { Component, Input } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { WebSocketService } from '../../../services/websocket.service';

@Component({
  selector: 'app-invite-modal',
  templateUrl: './invite-modal.component.html',
  styleUrls: ['./invite-modal.component.scss'],
})
export class InviteModalComponent {

	@Input() opponentFound: boolean = false;
	@Input() status: string = 'Waiting for friend to respond...';

	constructor(
		private readonly ngbModal: NgbModal,
		private readonly webSocketService: WebSocketService
	) { }

	leaveQueue() {
		this.webSocketService.disconnectQueue();
		this.ngbModal.dismissAll();
	}
}
