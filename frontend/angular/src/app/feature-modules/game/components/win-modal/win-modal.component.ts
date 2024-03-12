import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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

	constructor (
		private readonly ngbModal: NgbModal,
		private readonly router: Router,
		private readonly userService: UserService,
		private readonly tournamentService: TournamentService
	) { }

	ngOnInit(): void {
		this.nextPlayers = [];
		this.winner = '';

		this.userService.userInfo$.subscribe((user: User) => {
			console.log(user);
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
			if (this.tournamentService.tournamentPlayers.length === 0) 
			{
				this.tournamentService.tournamentPlayers = this.tournamentService.winners;
				this.tournamentService.winners = [];
			}
			this.nextPlayers.push(this.tournamentService.tournamentPlayers[0]);
			this.nextPlayers.push(this.tournamentService.tournamentPlayers[1]);
			// console.log('players are', this.tournamentService.tournamentPlayers);
			// console.log('next players are', this.nextPlayers);
			// console.log('winners are', this.tournamentService.winners);
		}
		if (this.tournament && this.tournamentService.tournamentPlayers.length === 0 && this.tournamentService.winners.length === 1)
		{
			this.endTournament = true;
			this.status = this.winner + ' wins the tournament';
		}
	}

	leaveMatch() {
		this.ngbModal.dismissAll();
		if (this.tournament) {
			this.tournamentService.tournamentPlayers = [];
			this.tournamentService.winners = [];
		}
		this.router.navigateByUrl('/user/' + this.user.id);
	}

	nextMatch() {
		this.ngbModal.dismissAll();
		if (this.gameResult.winner === 'P1')
			this.tournamentService.getNextGame(this.tournamentService.tournamentPlayers[0]);
		else
			this.tournamentService.getNextGame(this.tournamentService.tournamentPlayers[1]);
		this.ngbModal.dismissAll();
	}
}
