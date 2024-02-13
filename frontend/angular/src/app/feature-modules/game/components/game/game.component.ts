import { OnInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription, map } from 'rxjs';
import { GameService } from 'src/app/services/game.service';

interface GameData {
	id: string;
	paddle1: { x: number, y: number, score: number };
	paddle2: { x: number, y: number, score: number };
	ball: { x: number, y: number };
}
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
		ball: {x: 0, y: 0}
	};

	private routeSub: Subscription = this.router.params.subscribe((params: Params) => {
		this.gameElements.id = params['matchId'];
	});
	
	constructor(
		private readonly router: ActivatedRoute,
		private readonly gameService: GameService
		) { }
		
	ngOnInit() {
			this.gameloop(this.gameElements.id);
	}

	gameloop(match_id: string): void {
		console.log("gameloop");
		
		this.gameService.launchMatch(match_id);

		
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

		this.gameService.getGameElements().subscribe((data: GameData) => {
			ctx.drawImage(background, 0, 0);
			this.gameElements.ball = data.ball;
			this.gameElements.paddle1 = data.paddle1;
			this.gameElements.paddle2 = data.paddle2;
			ctx.drawImage(gameBall, this.gameElements.ball.x - 25, this.gameElements.ball.y - 25, 50, 50);
			ctx.drawImage(paddleL, this.gameElements.paddle1.x - 37,  this.gameElements.paddle1.y - 37,  75,  75);
			ctx.drawImage(paddleR, this.gameElements.paddle2.x - 37,  this.gameElements.paddle2.y - 37,  75,  75);
		});
	}

	NgOnDestroy() {
		this.routeSub.unsubscribe();
	}
}
