import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

import { CookieService } from './cookie.service';

import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class FriendService {

	constructor(
		private readonly http: HttpClient, 
		private readonly cookieService: CookieService
		) 
	{ }

	public getUserFriends(): Observable<User[] | null> {
		const token = this.cookieService.getCookie('authToken');
		const headers = new HttpHeaders().set('Authorization', `Token ${token}`);

		return this.http.get<any>('http://127.0.0.1:8000/users/getUserFriends/', { headers });
	}

	public addFriend(username: string): Observable<any | null> {
		console.log("accepting friend request from ", username);
		const token = this.cookieService.getCookie('authToken');
		const headers = new HttpHeaders().set('Authorization', `Token ${token}`);

		return this.http.post('http://127.0.0.1:8000/users/sendFriendRequest/', username, { headers });
	}

	public acceptFriendRequest(username: string): Observable<any | null> {
		const token = this.cookieService.getCookie('authToken');
		const headers = new HttpHeaders().set('Authorization', `Token ${token}`);

		const body = { "username": username };

		return this.http.post('http://127.0.0.1:8000/users/acceptFriendRequest/', body, { headers });
	}

	public getReceivedFriendRequests(): Observable<any | null> {
		const token = this.cookieService.getCookie('authToken');
		const headers = new HttpHeaders().set('Authorization', `Token ${token}`);

		return this.http.get<Observable<any | null>>('http://127.0.0.1:8000/users/getReceivedRequests/', { headers });
	}

	public getSentFriendRequests(): Observable<any | null> {
		const token = this.cookieService.getCookie('authToken');
		const headers = new HttpHeaders().set('Authorization', `Token ${token}`);

		return this.http.get<Observable<any | null>>('http://127.0.0.1:8000/users/getSentRequests/', { headers });
	}
}
