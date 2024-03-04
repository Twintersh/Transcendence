import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

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

	private destroy$ = new Subject<void>();

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
		this.authService.isAuth().subscribe({
			next: (isAuth) => {
				if (isAuth) {
					this.router.navigate(['/home']);
				}
			}
		});
	}

	signup(): void {
		this.modalService.open(AuthenticationComponent, { centered: true });
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}
}