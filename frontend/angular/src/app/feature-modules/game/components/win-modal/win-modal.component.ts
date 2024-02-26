import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { UserService } from 'src/app/services/user.service';
import { LocalDataManagerService } from 'src/app/services/local-data-manager.service';

import { GameResult, GamePlayers } from 'src/app/models/game.model';
import { User } from 'src/app/models/user.model';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-win-modal',
  templateUrl: './win-modal.component.html',
  styleUrls: ['./win-modal.component.scss']
})
export class WinModalComponent implements OnInit {

	@Input() gameResult: GameResult = {} as GameResult;
	@Input() players: GamePlayers = {} as GamePlayers;

	user: User = {} as User;
	win: boolean = false;

	constructor(
		private readonly ngbModal: NgbModal,
		private readonly router: Router,
		private readonly userService: UserService,
		private readonly localDataManagerService: LocalDataManagerService
	) { }

	ngOnInit(): void {
		this.userService.userInfo$.subscribe((user: User) => {
			this.user = user;
		});

		if ((this.user.username === this.players.player1.username && this.gameResult.winner === 'P1')
		 || (this.user.username === this.players.player2.username && this.gameResult.winner === 'P2')) {
			this.win = true;
		}
		console.log('end game data are ', this.gameResult);
		console.log('end players are ', this.players);
	}

	leaveMatch() {
		this.ngbModal.dismissAll();
		this.router.navigate(['/user']);
	}
}
