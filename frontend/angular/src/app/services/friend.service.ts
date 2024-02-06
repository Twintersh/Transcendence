import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

import { CookieService } from './cookie.service';

@Injectable({
  providedIn: 'root'
})
export class FriendService {

	constructor(
		private readonly http: HttpClient, 
		private readonly cookieService: CookieService
		) 
	{ }

	public getUserFriends(): Observable<any | null> {
		const token = this.cookieService.getCookie('authToken');
		const headers = new HttpHeaders().set('Authorization', `Token ${token}`);

		return this.http.get<any>('http://127.0.0.1:8000/users/getUserFriends/', { headers });
	}

	public addFriend(username: string): Observable<any | null> {
		const token = this.cookieService.getCookie('authToken');
		const headers = new HttpHeaders().set('Authorization', `Token ${token}`);

		const body = { username: username };

		return this.http.post<any>('http://127.0.0.1:8000/users/sendFriendRequest/', body, { headers });
	}
}
