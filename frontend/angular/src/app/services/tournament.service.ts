import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { GameService } from './game.service';

import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class TournamentService {

	private tournamentPlayers: string[] = [];
	private winners: string[] = [];
	private user: User = {} as User;
	private matchesId: string[] = [];

	constructor(
		private readonly gameService: GameService,
		private readonly router: Router
	) { }

	launchTournament(user: User, tournamentPlayers: string[]) {
		this.user = user;
		this.tournamentPlayers = tournamentPlayers;
		
		for (let i = 0; i < this.tournamentPlayers.length; i += 2) {
			this.gameService.getLocalMatch(this.user.username, this.user.username).subscribe((res: any) => {
				console.log(res);
				this.matchesId.push(res['match_id']);
			});
		}
		console.log(this.matchesId);
	}
}
