import { Component, OnInit } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

import { EditOffcanvasComponent } from '../edit-offcanvas/edit-offcanvas.component';
import { Game } from 'src/app/models/game.model';
import { User } from 'src/app/models/user.model';

import { UserService } from 'src/app/services/user.service';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
	gameList: Game[];
	user$: Observable<User> | null;
	user: User | null;

	constructor(private offcanvas: NgbOffcanvas, private userService: UserService) {
		this.gameList = [
			{ id: 1, title: 'Tennis', scoreOp1: 6, scoreOp2: 4, winner: 'John', loser: 'Jack' },
			{ id: 2, title: 'Basket', scoreOp1: 86, scoreOp2: 104, winner: 'John', loser: 'Jack' },
			{ id: 3, title: 'Foot', scoreOp1: 2, scoreOp2: 1, winner: 'John', loser: 'Jack' },
			{ id: 4, title: 'Tennis', scoreOp1: 6, scoreOp2: 4, winner: 'John', loser: 'Jack' },
			{ id: 5, title: 'Basket', scoreOp1: 86, scoreOp2: 104, winner: 'John', loser: 'Jack' },
			{ id: 6, title: 'Foot', scoreOp1: 2, scoreOp2: 1, winner: 'John', loser: 'Jack' },
		];

		this.user$ = null;
		this.user = null;
	}

	ngOnInit(): void {
		this.user$ = this.getUserInfos();
	}

	editProfile(): void {
		console.log('editProfile');
		this.offcanvas.open(EditOffcanvasComponent, { animation: true, backdrop: true });
	}

	getUserInfos(): Observable<User> {
		this.userService.getUserInfos().subscribe((user: User) => {
			this.user = user;
		});
		return this.userService.getUserInfos();
	}
}