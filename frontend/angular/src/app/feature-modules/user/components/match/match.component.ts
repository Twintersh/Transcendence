import { Component, Input, OnInit } from '@angular/core';

import { Game } from 'src/app/models/game.model';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss']
})
export class MatchComponent implements OnInit {
	@Input() game: Game = {} as Game;
	@Input() user: User = {} as User;
	win: boolean = false;

	constructor(
	) { }

	ngOnInit() {
		if (this.game.winner.username === this.user.username) {
			this.win = true;
		}
	}
}
