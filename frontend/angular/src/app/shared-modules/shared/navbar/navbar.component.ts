import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { FriendComponent } from '../friend/friend.component';

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
	) {
		this.router.setUpLocationChangeListener();
		router.events.subscribe((event) => {
			if (event instanceof NavigationEnd) {
				this.isAuth();
			}
		});
	}

	ngOnInit() {
		this.isAuth();
	}

	isAuth(): void {
		this.authService.isAuth$.subscribe((res) => {
			this.isAuthenticated = res;
		});
	};
	
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