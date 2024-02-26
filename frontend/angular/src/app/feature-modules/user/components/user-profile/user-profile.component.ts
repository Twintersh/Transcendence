import { Component, OnInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';

import { NgbOffcanvas, NgbOffcanvasRef } from '@ng-bootstrap/ng-bootstrap';

import { Observable } from 'rxjs';

import { UserService } from 'src/app/services/user.service';

import { Game } from 'src/app/models/game.model';
import { User } from 'src/app/models/user.model';

import { EditOffcanvasComponent } from '../edit-offcanvas/edit-offcanvas.component';
import { MatchComponent } from '../match/match.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserProfileComponent implements OnInit {
	user: User = {} as User;
	gameList: Game[] | null = null;
	gameList$: Observable<Game[] | null> | null = null;

	private edit!: NgbOffcanvasRef;

	constructor(
		private offcanvas: NgbOffcanvas,
		private userService: UserService
	) { }

	ngOnInit(): void {
		this.userService.userInfo$.subscribe({
			next: (response: User) => {
				if (response && Object.keys(response).length >  0) {
					this.user = response;
					const avatarUrl = response.avatar['image' as keyof typeof response.avatar];
					this.user.avatar = 'http://127.0.0.1:8000/' + avatarUrl;
				}
			},
			error: (error) => {
			  console.error('Fetch data user failed:', error);
			},
		});
		this.gameList$ = this.userService.getUserMatches();
		this.gameList$.subscribe({
			next: (response: any) => {
				this.gameList = response;
				console.log('game list:', response);
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
				this.userService.getUserInfos();
			},
			(error) => {}
		);
	}
}