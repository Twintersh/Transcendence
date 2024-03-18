import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { HttpClient, HttpHeaders } from '@angular/common/http';

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
		private cookieService: CookieService,
		private http: HttpClient
	) { }

	ngOnInit() {
		if (this.router.url.includes('?token=')) {
			let token: string = this.router.url.split('=')[1];
			this.cookieService.saveCookie('authToken', token);
			this.authService.nextValue(true);
			this.router.navigate(['/home']);
		}
		this.subscription.add(
			this.authService.isAuth$.subscribe((res: boolean) => {
				if (res) {
					this.router.navigate(['/home']);
				}
			}
		));
	}

	signup(): void {
		this.modalService.open(AuthenticationComponent, { centered: true });
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}