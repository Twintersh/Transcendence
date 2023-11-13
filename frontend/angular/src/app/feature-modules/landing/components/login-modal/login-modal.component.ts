import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss'],
})

export class LoginModalComponent {
	displayForm = false;

	constructor(private readonly NgbModal: NgbModal) {
	}

	close(): void {
		this.NgbModal.dismissAll('close');
	}

	signUp(): void {
		this.displayForm = true;
	}
}
