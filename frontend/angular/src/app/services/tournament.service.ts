import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { GameService } from './game.service';

import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class TournamentService {

	public tournamentPlayers: string[] = [];
	public winners: string[] = [];
	private user!: User;
	private matchesId: string[] = [];

	constructor(
		private readonly gameService: GameService,
		private readonly router: Router
	) { }

	createTournament(user: User, tournamentPlayers: string[]): void {
		this.user = user;
		this.tournamentPlayers = tournamentPlayers;
		
		this.gameService.getLocalMatch(this.user.username, this.user.username).subscribe((res: any) => {
			this.matchesId.push(res['id']);
			this.launchTournament();
		});
	}

	launchTournament(): void {
		console.log(this.tournamentPlayers);
		console.log(this.matchesId);
		this.router.navigateByUrl('game/tournament/' + this.matchesId[0]);
		//tournament modal next game
	}

	getNextGame(winner: string): void {
		this.matchesId.shift();
		this.tournamentPlayers.shift();
		this.tournamentPlayers.shift();
		this.winners.push(winner);
		this.gameService.getLocalMatch(this.user.username, this.user.username).subscribe((res: any) => {
			this.matchesId.push(res['id']);
			this.launchTournament();
		});
		console.log(this.tournamentPlayers);
		console.log(this.matchesId);
		console.log(this.winners);
		if (this.tournamentPlayers.length == 0) {
			this.tournamentPlayers = this.winners;
			this.winners = [];
		}
		document.location.href = 'https://127.0.0.1:4200/game/tournament/' + this.matchesId[0];
	}
}
