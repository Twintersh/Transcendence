import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})

export class LoginModalComponent {
	constructor(private readonly NgbModal: NgbModal) {
	}

	close(): void {
		console.log('close()');
		this.NgbModal.dismissAll('close');
	}
}
