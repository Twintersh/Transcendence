export interface User {
	id: number;
    email?: string;
    username: string;
    password?: string;
	MatchesCount?: number;
	wonMatchesCount?: number;
	gameRatio?: number;
	avatar: string;
	isActive: boolean;
}

export interface UpdatedUser {
	username: string;
	password: string;
	confirmPassword: string;
	avatar?: string;
}