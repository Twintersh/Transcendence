import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { GameService } from './game.service';
import { UserService } from './user.service';
import { WebSocketService } from './websocket.service';

import { User } from '../models/user.model';
import { Subscription, firstValueFrom, tap } from 'rxjs';

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

	async getNextGame(): Promise<any> {
		this.matchesId = '';
		return firstValueFrom(this.gameService.getLocalMatch(this.user.username, this.user.username).pipe(tap((res: any) => {
			this.matchesId = res['id'];
			this.websocketService.closeMatch();
			this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
				this.router.navigate(['game/tournament/' + this.matchesId]);
			});
		})));
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}
