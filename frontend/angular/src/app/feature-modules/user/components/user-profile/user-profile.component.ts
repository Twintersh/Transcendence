import { Component, OnInit } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

import { EditOffcanvasComponent } from '../edit-offcanvas/edit-offcanvas.component';
import { Game } from 'src/app/models/game.model';
import { User } from 'src/app/models/user.model';

import { UserService } from 'src/app/services/user.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
	gameList: Game[];
	user$!: Observable<User | null>;
	user!: User | null;

	constructor(private offcanvas: NgbOffcanvas, private userService: UserService) {
		this.gameList = [
			{ id: 1, title: 'Tennis', scoreOp1: 6, scoreOp2: 4, winner: 'John', loser: 'Jack' },
			{ id: 2, title: 'Basket', scoreOp1: 86, scoreOp2: 104, winner: 'John', loser: 'Jack' },
			{ id: 3, title: 'Foot', scoreOp1: 2, scoreOp2: 1, winner: 'John', loser: 'Jack' },
			{ id: 4, title: 'Tennis', scoreOp1: 6, scoreOp2: 4, winner: 'John', loser: 'Jack' },
			{ id: 5, title: 'Basket', scoreOp1: 86, scoreOp2: 104, winner: 'John', loser: 'Jack' },
			{ id: 6, title: 'Foot', scoreOp1: 2, scoreOp2: 1, winner: 'John', loser: 'Jack' },
		];
	}

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
	}

	editProfile(): void {
		this.offcanvas.open(EditOffcanvasComponent, { animation: true, backdrop: true }).result.then(
			(result) => {
				console.log('ok');
				this.offcanvas.dismiss();
				this.user$ = this.getUserInfos();
			},
			(reason) => {
				console.log('je suis la raison');
			},
		);
	}

	getUserInfos(): Observable<User | null> {
		return this.userService.getUserInfos();
	}
}