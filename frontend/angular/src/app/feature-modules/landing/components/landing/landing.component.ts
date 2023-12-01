import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginModalComponent } from '../login-modal/login-modal.component';

@Component({
  selector: 'landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})

export class LandingComponent {
	constructor(private readonly ngbModal: NgbModal) {
	}

	openModal(): void {
		console.log('loginModal()');
		this.ngbModal.open(LoginModalComponent, { size: 'md', centered: true });
	}
}