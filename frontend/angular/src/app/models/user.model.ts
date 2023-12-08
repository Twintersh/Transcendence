export interface User {
	id: number;
    email?: string;
    username: string;
    password?: string;
	MatchesCount?: number;
	wonMatchesCount?: number;
	gameRatio?: number;
	avatar: string;
}
