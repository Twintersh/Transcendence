import { OnInit, Component, ElementRef, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute, Params, NavigationSkipped, NavigationStart } from '@angular/router';

import { Subscription } from 'rxjs';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { GameService } from 'src/app/services/game.service';

import { GameData, GamePlayers, GameResult } from 'src/app/models/game.model';
import { WinModalComponent } from '../win-modal/win-modal.component';


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
	players: GamePlayers = {} as GamePlayers;
	local: boolean = false;
	winModal!: NgbModalRef;

	private routeSub: Subscription = new Subscription();
	
	constructor(
		private readonly router: Router,
		private readonly routerActive: ActivatedRoute,
		private readonly gameService: GameService,
		private readonly modalService: NgbModal
	) { }

	ngOnInit() {
		this.routeSub = this.routerActive.params.subscribe((params: Params) => {
			this.gameElements.id = params['matchId'];
		});

		this.router.events.subscribe((event) => {
			if (event instanceof NavigationStart && !this.gameService.gameEnded) {
				this.endGame(this.gameElements, this.players);
				this.gameService.getGameElements().unsubscribe();
			}
		});

		if (this.router.url.includes('local'))
			this.local = true;
		
		this.gameService.getPlayers(this.gameElements.id).subscribe((res: any) => {
			this.players.player1 = res.player1;
			this.players.player1.avatar = 'http://127.0.0.1:8000' + this.players.player1.avatar;
			if (this.local) {
				this.players.player2.username = this.gameService.localOpp;
				this.players.player2.avatar = this.players.player1.avatar;
			}
			else {
				this.players.player2 = res.player2;
				this.players.player2.avatar = 'http://127.0.0.1:8000' + this.players.player2.avatar;
			}
			console.log('player1 ', this.players.player1, 'player2', this.players.player2);
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
		
		if (ctx === null) {
			console.log("ctx is null");
			return;
		}
		
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
			ctx.drawImage(gameBall, this.gameElements.ball.x - 33, this.gameElements.ball.y - 33, 25, 25);
			ctx.drawImage(paddleL, this.gameElements.paddle1.x - 33,  this.gameElements.paddle1.y - 33,  75,  75);
			ctx.drawImage(paddleR, this.gameElements.paddle2.x - 33,  this.gameElements.paddle2.y - 33,  75,  75);
		});
	}

	
	endGame(data: GameData, players : GamePlayers): void {
		this.winModal = this.modalService.open(WinModalComponent, { centered: true, backdrop : 'static', keyboard : false});
		this.gameService.endGame();
		this.winModal.componentInstance.gameResult = data;
		this.winModal.componentInstance.players = players;
	}
	
	NgOnDestroy() {
		this.routeSub.unsubscribe();
	}
	
	showtimer(ctx: CanvasRenderingContext2D, width: number, height: number): void {
		ctx.fillStyle = "white";
		ctx.font = "50px Gopher";
		ctx.fillText("5", width / 2, height 	/ 2);
		setTimeout(() => {
			ctx.clearRect(0, 0, width, height);
			ctx.fillStyle = "#53A6AC";
			ctx.fillRect(0, 0, width, height);
			ctx.fillStyle = "white";
			ctx.fillText("4", width / 2, height / 2);
		}, 1000);
		setTimeout(() => {
			ctx.clearRect(0, 0, width, height);
			ctx.fillStyle = "#53A6AC";
			ctx.fillRect(0, 0, width, height);
			ctx.fillStyle = "white";
			ctx.fillText("3", width / 2, height / 2);
		}, 2000);
		setTimeout(() => {
			ctx.clearRect(0, 0, width, height);
			ctx.fillStyle = "#53A6AC";
			ctx.fillRect(0, 0, width, height);
			ctx.fillStyle = "white";
			ctx.fillText("2", width / 2, height / 2);
		}, 3000);
		setTimeout(() => {
			ctx.clearRect(0, 0, width, height);
			ctx.fillStyle = "#53A6AC";
			ctx.fillRect(0, 0, width, height);
			ctx.fillStyle = "white";
			ctx.fillText("1", width / 2, height / 2);
		}, 4000);
		setTimeout(() => {
			ctx.clearRect(0, 0, width, height);
			ctx.fillStyle = "#53A6AC";
			ctx.fillRect(0, 0, width, height);
			ctx.fillStyle = "white";
			ctx.fillText("GO!", width / 2 - 50, height / 2);
		}, 5000);
	}

	ngOnDestroy() {
		this.routeSub.unsubscribe();
		this.gameService.getGameElements().unsubscribe();
	}
}
