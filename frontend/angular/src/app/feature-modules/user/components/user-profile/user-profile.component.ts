import { Component, OnInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbOffcanvas, NgbOffcanvasRef} from '@ng-bootstrap/ng-bootstrap';

import { Observable } from 'rxjs';

import { UserService } from 'src/app/services/user.service';

import { Game } from 'src/app/models/game.model';
import { User } from 'src/app/models/user.model';

import { EditOffcanvasComponent } from '../edit-offcanvas/edit-offcanvas.component';
import { MatchComponent } from '../match/match.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserProfileComponent implements OnInit {
	id: number = 0;
	user: User = {} as User;
	gameList: Game[] | null = null;
	gameList$: Observable<Game[] | null> | null = null;

	private edit!: NgbOffcanvasRef;

	constructor(
		private offcanvas: NgbOffcanvas,
		private userService: UserService,
		private route: ActivatedRoute
	) { }

	ngOnInit(): void {
		this.route.url.subscribe({
			next: (url) => {
				this.id = parseInt(url[1].path);
				console.log('this id is:', this.id);
			},
			error: (error) => {
			  console.error('Fetch data user failed:', error);
			},
		});
		this.userService.getUserInfosById(this.id).subscribe({
			next: (response: User) => {
				if (this.id != 0) {
					this.user = response;
					console.log('user:', this.user);
					console.log('user:', response);
					this.SetPongoProgressBar();
				}
				//this.user.avatar = 'http://127.0.0.1:8000' + response.avatar;
			},
			error: (error) => {
				console.error('Fetch data user failed:', error);
			},
		});
		this.gameList$ = this.userService.getUserMatches();
		this.gameList$.subscribe({
			next: (response: any) => {
				this.gameList = response;
			},
			error: (error) => {
				console.error('Fetch data game list failed:', error);
			},
		});
	}

	editProfile(): void {
		this.edit = this.offcanvas.open(EditOffcanvasComponent, { animation: true, backdrop: true, panelClass: 'edit' });
		this.edit.componentInstance.avatar = this.user?.avatar;
		this.edit.result.then(
			(result) => {
				this.offcanvas.dismiss();
				this.userService.getUserInfos();
			},
			(error) => {}
		);
	}

	SetPongoProgressBar(): void {

		let nbrGames: number = 5;


		let pongoBar: HTMLElement | null = document.getElementById('pongoProgress');
		this.user.asWon = false;

		if (this.user.wonMatchesCount as number >= nbrGames)
			this.user.asWon = true;
		else if (pongoBar)
			pongoBar.style.width = (this.user.wonMatchesCount as number / nbrGames) * 100 + "%";
	}

}