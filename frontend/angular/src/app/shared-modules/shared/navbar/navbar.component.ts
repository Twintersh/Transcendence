import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

import { map, tap } from 'rxjs';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
	isAuthenticated: boolean = false;
	userAvatar?: string;

	constructor(
		private router: Router, 
		public authService: AuthService,
		private offcanvas: NgbOffcanvas
	) { }

	ngOnInit() {
		this.authService.isAuth$.pipe(
			map(isAuth => isAuth),
			tap(isAuth => this.isAuthenticated = isAuth)
		).subscribe();
		this.authService.isAuth().subscribe({
			next: (isAuth) => {
				if (isAuth) {
					this.isAuthenticated = true;
				}
			}
		});
	}
	
	logout(): void {
		this.authService.logout();
		this.isAuthenticated = false;
		this.authService.isAuthSubject.next(false);
		this.router.navigate(['/']);
	}

	ngOnDestroy() {
		this.offcanvas.dismiss();
	}
}