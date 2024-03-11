import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';

import { NgbOffcanvas, NgbOffcanvasRef} from '@ng-bootstrap/ng-bootstrap';

import { Observable } from 'rxjs';

import { UserService } from 'src/app/services/user.service';
import { LocalDataManagerService } from 'src/app/services/local-data-manager.service';

import { Game } from 'src/app/models/game.model';
import { User } from 'src/app/models/user.model';
import { HTTP_MODE, IP_SERVER } from 'src/env';

import { EditOffcanvasComponent } from '../edit-offcanvas/edit-offcanvas.component';

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
		private router: Router,
		private route: ActivatedRoute,
		private localDataManager: LocalDataManagerService
	) { }

	ngOnInit(): void {
		this.router.events.subscribe((event) => {
			if (event instanceof NavigationStart) {
				this.route.url.subscribe({
					next: (url) => {
						this.id = parseInt(url[1].path);
					},
					error: (error) => {
					  console.error('Bad Id:', error);
					},
				});
				this.getUserById();
			}
		});

		this.route.url.subscribe({
			next: (url) => {
				this.id = parseInt(url[1].path);
			},
			error: (error) => {
			  console.error('Bad Id:', error);
			},
		});

		this.getUserById();

		this.gameList$ = this.userService.getUserMatches(this.id);
		this.gameList$.subscribe({
			next: (response: any) => {
				this.gameList = response;
			},
			error: (error) => {
				console.error('Fetch data game list failed:', error);
			},
		});
	}

	getUserById(): void {
		console.log('fetching user:', this.id);
		this.userService.getUserInfosById(this.id).subscribe({
			next: (response: any) => {
				console.log('user:', response);
				if (this.id != 0) {
					this.user = response;
					this.user.avatar = HTTP_MODE + IP_SERVER + response.avatar.image;
					this.SetPongoProgressBar();
				}
			},
			error: (error) => {
				console.error('Fetch data user failed:', error);
			},
		});
	}

	editProfile(): void {
		this.edit = this.offcanvas.open(EditOffcanvasComponent, { animation: true, backdrop: true, panelClass: 'edit' });
		this.edit.componentInstance.avatar = this.user?.avatar;
		this.edit.result.then(
			(result) => {
				console.log('result:', result);
				this.offcanvas.dismiss();
				this.refreshUserInfos();
			},
			(error) => {
				this.offcanvas.dismiss();
				this.refreshUserInfos();
			}
		);
	}

	public refreshUserInfos(): void {
		this.userService.getUserInfosById(this.user.id).subscribe({
			next: (user) => {
				this.userService.nextUserInfo(user);
				this.localDataManager.saveData('userName', user.username);
				this.localDataManager.saveData('userAvatar', user.avatar);
			},
			error: (error) => {
				// Error: Handle the error if the user information retrieval fails
				console.error('User information retrieval failed:', error);
			}
		});
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