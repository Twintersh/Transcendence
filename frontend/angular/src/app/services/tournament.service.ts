import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { GameService } from './game.service';
import { UserService } from './user.service';
import { WebSocketService } from './websocket.service';

import { User } from '../models/user.model';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TournamentService {

	public tournamentPlayers!: string[];
	public winners: string[] = [];
	private user!: User;
	private matchesId!: string;

	subscription: Subscription = new Subscription();

	constructor(
		private readonly gameService: GameService,
		private readonly router: Router,
		private readonly userService: UserService,
		private readonly websocketService: WebSocketService
	) { }

	createTournament(tournamentPlayers: string[]): void {
		this.tournamentPlayers = tournamentPlayers;
		this.subscription.add(
			this.userService.getUserInfos().subscribe( {
				next: (res) => {
					this.user = res;
					this.gameService.getLocalMatch(this.user.username, this.user.username).subscribe((res: any) => {
						this.matchesId = res['id'];
						this.router.navigateByUrl('game/tournament/' + this.matchesId);
					});
				},
				error: (error) => {
					console.error('Error:', error);
				}
			})
		);
	}

	getNextGame(winner: string): void {
		this.matchesId = '';
		this.tournamentPlayers.shift();
		this.tournamentPlayers.shift();
		console.log('tournament players are ', this.tournamentPlayers);
		this.winners.push(winner);
		console.log('winner is', this.winners);
		if (this.tournamentPlayers.length == 0 && this.winners.length != 1) {
			this.tournamentPlayers = this.winners;
			this.winners = [];
		}
		this.gameService.getLocalMatch(this.user.username, this.user.username).subscribe((res: any) => {
			this.matchesId = res['id'];
			console.log('user is ', this.user);
			console.log('next game player are ', this.tournamentPlayers[0], this.tournamentPlayers[1]);
			console.log('next game id ', this.matchesId);
			this.router.navigateByUrl('home');
			setTimeout(() => {
				this.websocketService.closeMatch();
				this.router.navigateByUrl('game/tournament/' + this.matchesId);
			}, 50);
		});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}
