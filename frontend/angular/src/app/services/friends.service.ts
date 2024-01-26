import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user.model';
import { CookieService } from './cookie.service';
import { Observable, map, of, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FriendsService {
	friends!: User[];

	constructor(private readonly http: HttpClient, private readonly cookieService: CookieService) { }

	public getUserFriends(): Observable<User | null> {
		const token = this.cookieService.getCookie('authToken');
		const headers = new HttpHeaders().set('Authorization', `Token ${token}`);

		return this.http.get<User>('http://127.0.0.1:8000/users/getUserFriends/', { headers }).pipe(
			map((data: User) => {
				console.log('Friends informations fetched:', data);
				return data;
			}),
			catchError((error) => {
				console.error('Error fetching friends information:', error);
				// Return an observable with a default value or rethrow the error
				return of(null); // or throwError(error) if you want to rethrow the error
			})
		);
	}

	public sendFriendRequest(data: any): void {
	}

	public acceptFriendRequest(data: any): void {
	}

	public removeFriend(data: any): void {
	}

	public blockFriend(data: any): void {
	}
}