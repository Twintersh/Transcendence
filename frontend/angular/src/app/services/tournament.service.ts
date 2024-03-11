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
	private matchesId: string = '';

	constructor(
		private readonly gameService: GameService,
		private readonly router: Router
	) { }

	createTournament(user: User, tournamentPlayers: string[]): void {
		this.user = user;
		this.tournamentPlayers = tournamentPlayers;
		
		this.gameService.getLocalMatch(this.user.username, this.user.username).subscribe((res: any) => {
			this.matchesId = res['id'];
			this.launchTournament();
		});
	}

	launchTournament(): void {
		this.router.navigateByUrl('game/tournament/' + this.matchesId);
	}

	getNextGame(winner: string): void {
		this.matchesId = '';
		this.tournamentPlayers.shift();
		this.tournamentPlayers.shift();
		this.winners.push(winner);
		if (this.tournamentPlayers.length == 0) {
			this.tournamentPlayers = this.winners;
			this.winners = [];
		}
		this.gameService.getLocalMatch(this.user.username, this.user.username).subscribe((res: any) => {
			this.matchesId = res['id'];
			console.log('next gamae player ', this.tournamentPlayers);
			console.log('next game player ', this.winners);
			console.log('next game id ', this.matchesId);
			this.router.navigate(['game/tournament/' + this.matchesId]);
			//this.launchTournament();
		});
	}
}
