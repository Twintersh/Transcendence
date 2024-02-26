import { User } from './user.model';

export interface Game {
	id: number;
	lScore: number;
	wScore: number;
	winner: User;
}

export interface GameData {
	id: string;
	paddle1: { x: number, y: number, score: number };
	paddle2: { x: number, y: number, score: number };
	ball: { x: number, y: number };
}

export interface GameResult {
	winner: string;
	lScore: number;
	wScore: number;
	duration: number;
}

export interface Player {
	username: string;
	avatar: string;
	score: number;
	winner: boolean;
}

export interface GamePlayers {
	player1: Player;
	player2: Player;
}