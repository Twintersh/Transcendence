import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { Oauth42Service } from 'src/app/services/oauth42.service';

@Component({
  selector: 'login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss'],
})

export class LoginModalComponent {
	displayForm = false;

	constructor(private readonly NgbModal: NgbModal,
				private readonly OAuth42: Oauth42Service,
				private readonly HttpClient: HttpClient) {
	}

	close(): void {
		this.NgbModal.dismissAll('close');
	}

	signUp(): void {
		this.displayForm = true;
	}

	sign42(): void {
		console.log('sign42');
		this.OAuth42.login();
	}
}