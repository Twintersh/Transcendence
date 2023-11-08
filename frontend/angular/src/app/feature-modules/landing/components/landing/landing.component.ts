import { Component } from '@angular/core';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})

export class LandingComponent {
	constructor(private readonly ngbModal: NgbModal) {
	}

	loginModal(): void {
		console.log('loginModal()');
		this.ngbModal.open(LoginModalComponent, { size: 'lg', centered: true });
	}
}