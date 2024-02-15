import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';


import { GameService } from 'src/app/services/game.service';
import { CookieService } from 'src/app/services/cookie.service';

import { QueueModalComponent } from '../queue-modal/queue-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

	private modal!: NgbModalRef;

	constructor(private readonly gameService: GameService,
				private readonly cookie: CookieService,
				private readonly ngbModal: NgbModal,
				private readonly router: Router
	) { }
	
	joinOnlineMatch() {
		const token: string = this.cookie.getCookie("authToken");
		this.gameService.getMatch(token);
		this.gameService.QueueMessages$.subscribe((data) => {
			console.log(data);
			if (data['message'] == "connected to queue") {
				this.modal = this.ngbModal.open(QueueModalComponent, { centered: true, backdrop : 'static', keyboard : false});
				this.modal.componentInstance.opponentFound = false;
			}
			else if (data['response'] == "match_found") {
				console.log('match found');
				this.modal.componentInstance.opponentFound = true;
				this.modal.componentInstance.status = 'Match found! Launching game...';
				setTimeout(() => {
					this.modal.close();
					this.router.navigate(['/game/' + data['match_id']]);
				}, 2000);
			}
		});
	}
}