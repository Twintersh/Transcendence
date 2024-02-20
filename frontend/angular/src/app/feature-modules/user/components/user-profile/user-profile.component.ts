import { Component, OnInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';

import { NgbOffcanvas, NgbOffcanvasRef } from '@ng-bootstrap/ng-bootstrap';

import { EditOffcanvasComponent } from '../edit-offcanvas/edit-offcanvas.component';
import { Game } from 'src/app/models/game.model';
import { User } from 'src/app/models/user.model';

import { UserService } from 'src/app/services/user.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserProfileComponent implements OnInit {
	user$!: Observable<User | null>;
	user!: User | null;
	gameList: Game[] | null = null;
	gameList$: Observable<Game[] | null> | null = null;

	private edit!: NgbOffcanvasRef;

	constructor(
		private offcanvas: NgbOffcanvas,
		private userService: UserService
	) { }

	ngOnInit(): void {
		this.user$ = this.getUserInfos();
		this.user$.subscribe({
			next: (response: any) => {
				this.user = response;
			},
			error: (error) => {
			  console.error('Fetch data user failed:', error);
			},
		});
		this.userService.getUserAvatar().subscribe({
			next: (response: any) => {
				if (this.user) {
					this.user.avatar = 'http://127.0.0.1:8000' + response.avatar;
				}
			},
			error: (error) => {
			  console.error('Fetch data avatar failed:', error);
			},
		});
		this.gameList$ = this.userService.getUserMatches();
		this.gameList$.subscribe({
			next: (response: any) => {
				this.gameList = response;
			},
			error: (error) => {
			  console.error('Fetch data game list failed:', error);
			},
		});
	}

	editProfile(): void {
		this.edit = this.offcanvas.open(EditOffcanvasComponent, { animation: true, backdrop: true, panelClass: 'edit' });
		this.edit.componentInstance.avatar = this.user?.avatar;
		this.edit.result.then(
			(result) => {
				this.offcanvas.dismiss();
				this.user$ = this.getUserInfos();
			},
			(reason) => {
				console.log(reason);
			},
		);
	}

	getUserInfos(): Observable<User | null> {
		return this.userService.getUserInfos();
	}
}