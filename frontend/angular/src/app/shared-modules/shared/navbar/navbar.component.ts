import { Component, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { map, tap } from 'rxjs';


import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';

import { FriendComponent } from '../friend/friend.component';


import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
	isAuthenticated: boolean = false;
	userId: number = 0;

	constructor(
		private router: Router,
		public authService: AuthService,
		private offcanvas: NgbOffcanvas,
		private userService: UserService
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

	toMyProfile(): void {
		this.userService.userInfo$.subscribe({
			next: (response) => {
				if (response && Object.keys(response).length > 0) {
					this.userId = response.id;
				}
			}
		});
		this.offcanvas.dismiss();
		this.router.navigate(['/user/' + this.userId]);
	}

	ngOnDestroy() {
		this.offcanvas.dismiss();
	}
}