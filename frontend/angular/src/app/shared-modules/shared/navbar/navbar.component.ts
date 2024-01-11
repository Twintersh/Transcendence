import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../services/auth.service'

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
	isAuthenticated: boolean = false;

	constructor(private router: Router, public authService: AuthService) {
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
		this.authService.isAuth().subscribe((res) => {
			this.isAuthenticated = res;	
			if (this.router.url.includes('landing'))
				this.isAuthenticated = false;
		})
	};
	
	logout(): void {
		this.authService.logout();
		this.isAuthenticated = false;
		this.router.navigate(['/landing']);
	}
}