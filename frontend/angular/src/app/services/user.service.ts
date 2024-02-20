import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

import { User } from '../models/user.model';
import { CookieService } from './cookie.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

	constructor(
		private readonly http: HttpClient, 
		private readonly cookieService: CookieService
		) 
	{ }

	public getUserInfos(): Observable<User | null> {
		const token = this.cookieService.getCookie('authToken');
		const headers = new HttpHeaders().set('Authorization', `Token ${token}`);

		return this.http.get<User>('http://127.0.0.1:8000/users/getUserInfo/', { headers });
	}

	public getUserMatches(): Observable<User | null> {
		const token = this.cookieService.getCookie('authToken');
		const headers = new HttpHeaders().set('Authorization', `Token ${token}`);

		return this.http.get<User>('http://127.0.0.1:8000/users/getUserMatches/', { headers });
	}

	public getUserAvatar(): Observable<any> {
		const token = this.cookieService.getCookie('authToken');
		const headers = new HttpHeaders().set('Authorization', `Token ${token}`);

		return this.http.get<any>('http://127.0.0.1:8000/users/getUserAvatar/', { headers });
	}

	// ON NE SUBSCRIBE PAS DANS UN SERVICE
	public updateUserInfos(data: any): Observable<any> {
		const token = this.cookieService.getCookie('authToken');//DRY
		const headers = new HttpHeaders().set('Authorization', `Token ${token}`);//DRY
		return this.http.post('http://localhost:8000/users/updateCredential/', data, { headers });
	}

	public updateProfilePicture(data: any): void {
		const token = this.cookieService.getCookie('authToken');
		const headers = new HttpHeaders().set('Authorization', `Token ${token}`);
		this.http.post('http://localhost:8000/users/uploadAvatar/', data, { headers }).subscribe({
			next: () => {
				console.log('User avatar updated');
				this.getUserInfos().subscribe({
					next: (data) => {
					},
					error: (error) => {
						console.error('Error updating user information:', error);
					}
				});
			},
			error: (error) => {
				// Error: Handle the error if the user information update fails
				console.error('User information update failed:', error);
			},
		});
	}
}