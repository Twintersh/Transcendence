import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';


import { GameService } from 'src/app/services/game.service';
import { CookieService } from 'src/app/services/cookie.service';
import { UserService } from 'src/app/services/user.service';

import { QueueModalComponent } from '../queue-modal/queue-modal.component';
import { AddPlayerModalComponent } from '../add-player-modal/add-player-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

	private modal!: NgbModalRef;
	private username: string = '';

	constructor (
		private readonly router: Router,
		private readonly ngbModal: NgbModal,
		private readonly gameService: GameService,
		private readonly cookie: CookieService,
		private readonly userService: UserService
	) { }
	
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
					this.userService.userInfo$.subscribe((res) => {
						this.username = res.username;
					});
					this.gameService.getLocalMatch(this.username, this.username).subscribe((res) => {
						this.modal.close();
						this.router.navigate(['/game/local/' + res['id']]);
					});
				}
			},
			(reason) => {
				console.log('Modal dismissed with reason:', reason);
			});
	}

	ngOnDestroy() {
		this.gameService.QueueMessages$.unsubscribe();
	}
}