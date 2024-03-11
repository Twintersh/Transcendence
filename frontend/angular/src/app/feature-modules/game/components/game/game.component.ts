import { OnInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params, NavigationStart } from '@angular/router';

import { Subscription } from 'rxjs';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { GameService } from 'src/app/services/game.service';
import { TournamentService } from 'src/app/services/tournament.service';

import { GameData, GamePlayers } from 'src/app/models/game.model';
import { WinModalComponent } from '../win-modal/win-modal.component';
import { HTTP_MODE, IP_SERVER } from 'src/env';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
	@ViewChild('pongCanvas', { static: true }) pongCanvas!: ElementRef<HTMLCanvasElement>;
	@ViewChild('background', { static: true }) background!: ElementRef<HTMLImageElement>;
	@ViewChild('paddleLeft', { static: true }) paddleL!: ElementRef<HTMLImageElement>;
	@ViewChild('paddleRight', { static: true }) paddleR!: ElementRef<HTMLImageElement>;
	@ViewChild('gameBall', { static: true }) gameBall!: ElementRef<HTMLImageElement>;
	
	gameElements: GameData = {
		id: '',
		paddle1: {x: 0, y: 0, score: 0},
		paddle2: {x: 0, y: 0, score: 0},
		ball: {x: 0, y: 0},
	};
	players: GamePlayers = {
		player1: {username: '', avatar: '', score: 0},
		player2: {username: '', avatar: '', score: 0}
	} as GamePlayers;
	local: boolean = false;
	tournament: boolean = false;
	localOpp: string = '';
	winModal!: NgbModalRef;

	private routeSub: Subscription = new Subscription();
	
	constructor(
		private readonly router: Router,
		private readonly routerActive: ActivatedRoute,
		private readonly gameService: GameService,
		private readonly modalService: NgbModal,
		private readonly tournamentService: TournamentService
	) { }

	ngOnInit() {
		if (this.router.url.includes('local') || this.router.url.includes('tournament'))
			this.local = true;

		if (this.router.url.includes('tournament'))
			this.tournament = true;

		this.routeSub = this.routerActive.params.subscribe((params: Params) => {
			this.gameElements.id = params['matchId'];
		});

		this.router.events.subscribe((event) => {
			if (event instanceof NavigationStart && !this.gameService.gameEnded) {
				this.endGame(this.gameElements, this.players);
				this.gameService.getGameElements().unsubscribe();
			}
		});
		
		this.gameService.getPlayers(this.gameElements.id).subscribe((res: any) => {
			this.players.player1 = res.player1;
			this.players.player1.avatar = HTTP_MODE + IP_SERVER + this.players.player1.avatar;
			if (this.tournament) {
				this.players.player1.username = this.tournamentService.tournamentPlayers[0];
				this.players.player2.username = this.tournamentService.tournamentPlayers[1];
				this.players.player2.avatar = this.players.player1.avatar;
			}
			else if (this.local) {
				this.players.player2.username = this.gameService.localOpp;
				this.players.player2.avatar = this.players.player1.avatar;
			}
			else {
				this.players.player2 = res.player2;
				this.players.player2.avatar = HTTP_MODE + IP_SERVER + this.players.player2.avatar;
			}

			console.log("This.Players in game.component.ts");
			console.log(this.players);
			
		});
		this.gameloop(this.gameElements.id, this.local);
	}

	gameloop(match_id: string, local: boolean): void {
		const canvas: HTMLCanvasElement = this.pongCanvas.nativeElement;
		const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
		
		const background: HTMLImageElement = this.background.nativeElement;
		const paddleL: HTMLImageElement = this.paddleL.nativeElement;
		const paddleR: HTMLImageElement = this.paddleR.nativeElement;
		const gameBall: HTMLImageElement = this.gameBall.nativeElement;
		
		if (ctx === null)
			return;
		
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = "#53A6AC";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		
		this.showtimer(ctx, canvas.width, canvas.height);
		
		setTimeout(() => {
			this.gameService.launchMatch(match_id, local);
		}, 6000);

		this.gameService.getGameElements().subscribe((data: GameData) => {
			if (data['winner' as keyof GameData]) {
				this.endGame(data, this.players);
				return;
			}
			ctx.drawImage(background, 0, 0);
			this.gameElements.ball = data.ball;
			this.gameElements.paddle1 = data.paddle1;
			this.gameElements.paddle2 = data.paddle2;
			this.players.player1.score = data.paddle1.score;
			this.players.player2.score = data.paddle2.score;
			ctx.drawImage(gameBall, this.gameElements.ball.x - 12.5, this.gameElements.ball.y - 12.5, 25, 25);
			ctx.drawImage(paddleL, this.gameElements.paddle1.x,  this.gameElements.paddle1.y,  25,  100);
			ctx.drawImage(paddleR, this.gameElements.paddle2.x,  this.gameElements.paddle2.y,  25,  100);
		});
	}

	
	endGame(data: GameData, players : GamePlayers): void {
		console.log('end game');
		console.log(data);
		console.log(players);
		this.winModal = this.modalService.open(WinModalComponent, { centered: true, backdrop : 'static', keyboard : false});
		this.winModal.componentInstance.gameResult = data;
		this.winModal.componentInstance.players = players;
		this.winModal.componentInstance.tournament = this.tournament;
		this.gameService.endGame();
	}
	
	showtimer(ctx: CanvasRenderingContext2D, width: number, height: number): void {
		ctx.fillStyle = "white";
		ctx.font = "50px Gopher";
		const numbers = ["5", "4", "3", "2", "1", "GO!"];
		const delay = 1000;
	
		numbers.forEach((number, index) => {
			setTimeout(() => {
				ctx.clearRect(0, 0, width, height);
				ctx.fillStyle = "#53A6AC";
				ctx.fillRect(0, 0, width, height);
				ctx.fillStyle = "white";
				ctx.fillText(number, width / 2 - (number === "GO!" ? 50 : 0), height / 2);
			}, (index + 1) * delay);
		});
	}

	ngOnDestroy() {
		this.routeSub.unsubscribe();
		this.gameService.getGameElements().unsubscribe();
	}
}
