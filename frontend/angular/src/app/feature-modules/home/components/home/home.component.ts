import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { GameService } from 'src/app/services/game.service';
import { CookieService } from 'src/app/services/cookie.service';
import { UserService } from 'src/app/services/user.service';
import { TournamentService } from 'src/app/services/tournament.service';

import { QueueModalComponent } from '../queue-modal/queue-modal.component';
import { AddPlayerModalComponent } from '../add-player-modal/add-player-modal.component';

import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

	private modal!: NgbModalRef;
	private user: User = {} as User;
	private tournamentPlayers: string[] = [];

	constructor (
		private readonly router: Router,
		private readonly ngbModal: NgbModal,
		private readonly gameService: GameService,
		private readonly cookie: CookieService,
		private readonly userService: UserService,
		private readonly tournamentService: TournamentService
	) { }

	ngOnInit() {
		this.userService.userInfo$.subscribe((res) => {
			this.user = res;
		});
	}
	
	joinOnlineMatch() {
		this.gameService.getMatch(false);
		this.gameService.QueueMessages$.subscribe((data) => {
			if (data['message'] == "connected to queue") {
				this.modal = this.ngbModal.open(QueueModalComponent, { centered: true, backdrop : 'static', keyboard : false});
				this.modal.componentInstance.opponentFound = false;
			}
			else if (data['response'] == "match_found") {
				this.gameService.disconnectQueue();
				this.modal.componentInstance.opponentFound = true;
				this.modal.componentInstance.status = 'Match found! Launching game...';
				setTimeout(() => {
					this.modal.close();
					this.router.navigate(['/game/' + data['match_id']]);
				}, 2000);
			}
		});
	}

	createLocalMatch() {
		const token: string = this.cookie.getCookie("authToken");
		this.modal = this.ngbModal.open(AddPlayerModalComponent, { centered: true });
		this.modal.result.then(
			(result) => {
				if (result != undefined) {
					this.gameService.localOpp = result;
					this.gameService.getLocalMatch(this.user.username, this.user.username).subscribe((res) => {
						console.log(res);
						this.modal.close();
						this.router.navigate(['/game/local/' + res['id']]);
					});
				}
			},
			(reason) => {
				console.log(reason);
			});
	}

	createTournament() {
		const token: string = this.cookie.getCookie("authToken");
		this.tournamentPlayers.push(this.user.username);
		let modal: NgbModalRef = this.ngbModal.open(AddPlayerModalComponent, { centered: true });
		modal.componentInstance.tournament = true;
		modal.result.then(
			(result) => {
				this.tournamentPlayers.push(...result);
				this.tournamentService.launchTournament(this.user, this.tournamentPlayers);
			},
			(reason) => {
				console.log(reason);
			}
		);
	}

	ngOnDestroy() {
		this.gameService.QueueMessages$.unsubscribe();
	}
}