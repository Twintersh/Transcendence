import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../services/auth.service'
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
	isAuthenticated: boolean = false;
	userAvatar?: string;

	constructor(private router: Router, public authService: AuthService, private userService: UserService) {
		this.router.setUpLocationChangeListener();
		router.events.subscribe((event) => {
			if (event instanceof NavigationEnd) {
				this.isAuth();
			}
		});
	}

	ngOnInit() {
		this.isAuth();
		this.userService.getUserAvatar().subscribe((res) => {
			console.log('res:', res);
			this.userAvatar = 'http://127.0.0.1:8000' + res.avatar;
		});
	}

	isAuth(): void {
		this.authService.isAuth().subscribe((res) => {
			this.isAuthenticated = res;
			if (this.router.url.includes('game'))
				this.isAuthenticated = false;
		})
	};
	
	logout(): void {
		this.authService.logout();
		this.isAuthenticated = false;
		this.router.navigate(['']);
	}
}