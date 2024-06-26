import { Component, Inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { UserService } from 'src/app/services/user.service';
import { TournamentService } from 'src/app/services/tournament.service';

import { GameResult, GamePlayers } from 'src/app/models/game.model';
import { User } from 'src/app/models/user.model';


interface GameModal {
	gameResult: GameResult;
	players: GamePlayers;
	user: User;
	win: boolean;
	tournament: boolean;
}

@Component({
	selector: 'app-win-modal',
	templateUrl: './win-modal.component.html',
	styleUrls: ['./win-modal.component.scss']
})
export class WinModalComponent implements OnInit {

	@Input() gameResult!: GameResult;
	@Input() players!: GamePlayers;
	@Input() tournament!: boolean;
	user!: User;
	win: boolean = false;
	winner!: string;
	endTournament: boolean = false;
	nextPlayers: string[] = [];
	status: string = 'Winner';

	constructor(
		public modalRef: NgbActiveModal,
		private readonly router: Router,
		private readonly userService: UserService,
		private readonly tournamentService: TournamentService
	) { }

	ngOnInit(): void {
		this.nextPlayers = [];
		this.winner = '';
		this.status = '';

		this.userService.userInfo$.subscribe((user: User) => {
			this.user = user;
			if ((this.user.username === this.players.player1.username && this.gameResult.winner === 'P1')
				|| (this.user.username === this.players.player2.username && this.gameResult.winner === 'P2')) {
				this.win = true;
				this.winner = this.user.username;
				this.status = 'You win';
			}
			else {
				this.winner = this.gameResult.winner === 'P1' ? this.players.player1.username : this.players.player2.username;
				this.status = 'You lost';
			}
		});

		if (this.tournament) {
			if (this.gameResult.winner === 'P1')
				this.winner = this.tournamentService.tournamentPlayers[0];
			else
				this.winner = this.tournamentService.tournamentPlayers[1];
			this.tournamentService.winners.push(this.winner);
			this.status = this.winner + ' wins the game';
			this.tournamentService.tournamentPlayers.shift();
			this.tournamentService.tournamentPlayers.shift();
			if (this.tournamentService.tournamentPlayers.length <= 1) {
				this.tournamentService.tournamentPlayers = this.tournamentService.winners;
				this.tournamentService.winners = [];
			}
			this.nextPlayers.push(this.tournamentService.tournamentPlayers[0]);
			this.nextPlayers.push(this.tournamentService.tournamentPlayers[1]);
		}
		if (this.tournament && this.tournamentService.tournamentPlayers.length === 1 && this.tournamentService.winners.length === 0) {
			this.endTournament = true;
			this.status = this.winner + ' wins the tournament';
		}
	}

	leaveMatch() {
		if (this.tournament) {
			this.tournamentService.tournamentPlayers = [];
			this.tournamentService.winners = [];
			this.tournament = false;
			this.endTournament = false;
		}
		window.location.href = '/user/' + this.user.id;
	}

	nextMatch() {
		this.tournamentService.getNextGame().then(() => {
			this.modalRef.close();
		});
	}
}
