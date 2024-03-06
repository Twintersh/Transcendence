import { Component, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { filter, map, switchMap, tap } from 'rxjs';


import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';

import { FriendComponent } from '../friend/friend.component';


import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { c } from 'vite/dist/node/types.d-AKzkD8vd';

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
	isAuthenticated!: boolean;
	userId: number = 0;

	constructor(
		private router: Router,
		public authService: AuthService,
		private offcanvas: NgbOffcanvas,
		private userService: UserService
	) { }

	ngOnInit() {
		// this.authService.isAuth$.pipe(
		// 	filter((isAuth) => isAuth),
		// 	tap(() => this.isAuthenticated = true),
		// 	tap(() => console.log('isAuth in navbar is ', this.isAuthenticated))
		// ).subscribe();
		this.authService.isAuth().subscribe({
			next: (isAuth) => {
				console.log('isAuth in navbar is ', isAuth);
				if (isAuth) {
					this.isAuthenticated = true;
				}
			}
		});
	}
	
	logout(): void {
		this.authService.logout();
		this.isAuthenticated = false;
		this.router.navigate(['/']);
	}

	toMyProfile(): void {
		this.userService.userInfo$.subscribe({
			next: (response) => {
				if (response && Object.keys(response).length > 0) {
					this.userId = response.id;
					this.offcanvas.dismiss();
					this.router.navigate(['/user/' + this.userId]);
				}
			}
		});
	}

	ngOnDestroy() {
		this.offcanvas.dismiss();
	}
}