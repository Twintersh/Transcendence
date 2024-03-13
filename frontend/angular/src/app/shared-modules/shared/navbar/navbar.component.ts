import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationStart } from '@angular/router';

import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { LocalDataManagerService } from '../../../services/local-data-manager.service';
import { CookieService } from '../../../services/cookie.service';

import { FriendComponent } from '../friend/friend.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';


@Component({
	selector: 'navbar',
	standalone: true,
	imports: [
		CommonModule,
		NgbModule,
		FriendComponent,
		FormsModule,
		ReactiveFormsModule
	],
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
	isAuthenticated: boolean = true;
	userId: number = 0;

	subscription = new Subscription();

	constructor(
		private router: Router,
		public authService: AuthService,
		private offcanvas: NgbOffcanvas,
		private userService: UserService,
		private localDataManager: LocalDataManagerService,
		private cookieService: CookieService
	) { }

	ngOnInit() {
		this.router.events.subscribe((event) => {
			if (event instanceof NavigationStart) {
				if (!this.cookieService.getCookie('authToken')) {
					this.isAuthenticated = false;
				}
				else {
					this.isAuthenticated = true;	
				}
			}
		});
		if (!this.cookieService.getCookie('authToken')) {
			this.isAuthenticated = false;
		}
		else {
			this.isAuthenticated = true;	
		}
	}

	
	logout(): void {
		this.subscription.add(
			this.authService.logout().subscribe({
				next: (res) => {
					this.offcanvas.dismiss();
					this.cookieService.deleteCookie('authToken');
					this.localDataManager.removeData('userName');
					this.localDataManager.removeData('userAvatar');
					this.isAuthenticated = false;
					this.authService.nextValue(false);
					this.router.navigateByUrl('/');
				},
				error: (error) => {
					console.error('Logout failed:', error);
				},
			})
		);
	}

	toMyProfile(): void {
		this.subscription.add(
			this.userService.userInfo$.subscribe({
				next: (response) => {
					if (response && Object.keys(response).length > 0) {
						this.userId = response.id;
						this.offcanvas.dismiss();
						this.router.navigateByUrl('/user/' + this.userId);
					}
				},
				error: (error) => {
					console.error('User information failed:', error);
				}
			})
		);
	}

	toChat(): void {
		this.offcanvas.dismiss();
		this.router.navigateByUrl('/chat');
	}

	toHome(): void {
		this.offcanvas.dismiss();
		this.router.navigateByUrl('/home');
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
		this.offcanvas.dismiss();
	}
}