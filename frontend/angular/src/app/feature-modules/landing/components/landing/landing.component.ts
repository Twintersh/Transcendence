import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subject, Subscription, filter, tap } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from '../../../../services/auth.service';
import { CookieService } from '../../../../services/cookie.service';

import { AuthenticationComponent } from '../authentication/authentication.component';

@Component({
  selector: 'landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})

export class LandingComponent implements OnInit {

	private subscription = new Subscription();

	constructor(
		private authService: AuthService,
		private router: Router,
		private modalService: NgbModal,
		private cookieService: CookieService
	) { }

	ngOnInit() {
		if (this.router.url.includes('?token=')) {
			console.log('token:', this.router.url.split('=')[1]);
			this.cookieService.saveCookie('authToken', this.router.url.split('=')[1]);
		}
	}

	signup(): void {
		console.log(this.authService.isAuthSubject);
		if (this.authService.isAuthSubject) {
			this.router.navigate(['/home']);
		} else {
			this.modalService.open(AuthenticationComponent, { centered: true });
		}
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}