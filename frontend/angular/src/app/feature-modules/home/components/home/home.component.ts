import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { GameService } from 'src/app/services/game.service';
import { UserService } from 'src/app/services/user.service';
import { TournamentService } from 'src/app/services/tournament.service';

import { QueueModalComponent } from '../queue-modal/queue-modal.component';
import { AddPlayerModalComponent } from '../add-player-modal/add-player-modal.component';

import { User } from 'src/app/models/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

	private modal!: NgbModalRef;
	private user: User = {} as User;
	private tournamentPlayers: string[] = [];
	subscription = new Subscription();

	constructor (
		private readonly router: Router,
		private readonly ngbModal: NgbModal,
		private readonly gameService: GameService,
		private readonly userService: UserService,
		private readonly tournamentService: TournamentService
	) { }

	ngOnInit() {
		this.subscription.add(
			this.userService.userInfo$.subscribe({
				next: (user) => {
					this.user = user;
					if (this.user.username == undefined) {
						this.inializeUser();
					}
				},
				error: (error) => {
					console.error('Error:', error);
				}
			})
		)
	}

	private inializeUser(): void {
		this.subscription.add(
			this.userService.getUserInfos().subscribe({
				next: (res) => {
					this.userService.nextUserInfo(res);
				},
				error: (error) => {
					console.error('Error:', error);
				}
			})
		)
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
					this.router.navigateByUrl('/game/' + data['match_id']);
				}, 2000);
			}
		});
	}

	createLocalMatch() {
		this.modal = this.ngbModal.open(AddPlayerModalComponent, { centered: true });
		this.modal.result.then(
			(result) => {
				console.log(result);
				if (result != undefined) {
					this.gameService.localOpp = result;
					this.gameService.getLocalMatch(this.user.username, this.user.username).subscribe({
						next: (res) => {
							console.log(res);
							this.modal.close();
							this.router.navigateByUrl('/game/local/' + res['id']);
						},
						error: (error) => {
							console.error('Error:', error);
						}
					});
				}
			},
			(reason) => {
				console.log(reason);
			});
	}

	createTournament() {
		this.tournamentPlayers.push(this.user.username);
		let modal: NgbModalRef = this.ngbModal.open(AddPlayerModalComponent, { centered: true });
		modal.componentInstance.tournament = true;
		modal.result.then(
			(result) => {
				this.tournamentPlayers.push(...result);
				this.tournamentService.createTournament(this.user, this.tournamentPlayers);
			},
			(reason) => {
				console.log(reason);
			}
		);
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
		this.gameService.QueueMessages$.unsubscribe();
	}
}