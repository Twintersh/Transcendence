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

	createTournament(user: User, tournamentPlayers: string[]) {
		this.user = user;
		this.tournamentPlayers = tournamentPlayers;
		
		for (let i = 0; i < this.tournamentPlayers.length; i += 2) {
			this.gameService.getLocalMatch(this.user.username, this.user.username).subscribe((res: any) => {
				this.matchesId.push(res['id']);
				if (this.matchesId.length == this.tournamentPlayers.length / 2)
					this.launchTournament();
			});
		}
	}

	launchTournament() {
		console.log(this.tournamentPlayers);
		console.log(this.matchesId);
		this.router.navigate(['game/tournament/' + this.matchesId[0]]);
	}
}
