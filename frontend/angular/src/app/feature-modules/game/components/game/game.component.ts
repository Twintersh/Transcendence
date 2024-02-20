import { OnInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { GameService } from 'src/app/services/game.service';

interface GameData {
	id: string;
	player1: number;
	player2: number;
	player1_score: number;
	player2_score: number;
	winner: number;
	
	paddleR: number[];
	paddleL: number[];
	ballPos: number[];
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
	
	match_id: string = '';
	private routeSub: Subscription = this.router.params.subscribe((params: Params) => {
		this.match_id = params['matchId'];
	});
	
	constructor(
		private readonly router: ActivatedRoute,
		private readonly gameService: GameService
		) { }
		
	ngOnInit() {
			this.gameloop(this.match_id);
	}

	gameloop(match_id: string): void {
		console.log("gameloop");
		
		this.gameService.launchMatch(match_id);

		this.gameService.getGameElements().subscribe((data: GameData) => {
			console.log(data);
		});
		
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

		background.onload = function() {
			ctx.drawImage(background, 0, 0);
		}
		paddleL.onload = function() {
			ctx.drawImage(paddleL, -10, 200, 75, 75);
		}
		paddleR.onload = function() {
			ctx.drawImage(paddleR, 575, 200, 75, 75);
		}
	}

	NgOnDestroy() {
		this.routeSub.unsubscribe();
	}
}
