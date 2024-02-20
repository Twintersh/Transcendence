import { Component } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { CookieService } from 'src/app/services/cookie.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

	constructor(private readonly gameService: GameService, private readonly cookie: CookieService) {
	}

	joinOnlineMatch() {
		const token: string = this.cookie.getCookie("authToken");
		this.gameService.getMatch(token);
	}
}