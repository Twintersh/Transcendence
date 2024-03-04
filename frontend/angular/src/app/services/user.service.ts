import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable, BehaviorSubject } from 'rxjs';

import { CookieService } from './cookie.service';
import { LocalDataManagerService } from './local-data-manager.service';

import { Game } from 'src/app/models/game.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

	private userInfoSubject = new BehaviorSubject<User>({} as User);
	userInfo$ = this.userInfoSubject.asObservable();

	constructor(
		private readonly http: HttpClient, 
		private readonly cookieService: CookieService,
		private readonly localDataManager: LocalDataManagerService
	) { 
		this.getUserInfos();
	}

	public getUserInfos(): void {
		const token = this.cookieService.getCookie('authToken');
		const headers = new HttpHeaders().set('Authorization', `Token ${token}`);
		
		this.http.get<User>('http://127.0.0.1:8000/users/getUserInfo/', { headers }).subscribe(user => {
			this.userInfoSubject.next(user);
			this.localDataManager.saveData('userName', user.username);
			this.localDataManager.saveData('userAvatar', user.avatar);
		});
	}

	public getUserInfosById(id: number): Observable<User> {
		const token = this.cookieService.getCookie('authToken');
		const headers = new HttpHeaders().set('Authorization', `Token ${token}`);

		let params = new HttpParams().set('id', id.toString());

		return this.http.get<User>('http://127.0.0.1:8000/users/getUserInfoById/', { headers, params });
	}

	public getUserMatches(): Observable<Game[]> {
		const token = this.cookieService.getCookie('authToken');
		const headers = new HttpHeaders().set('Authorization', `Token ${token}`);

		return this.http.get<Game[]>('http://127.0.0.1:8000/users/getUserMatches/', { headers });
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
				this.getUserInfos();
			},
			error: (error) => {
				// Error: Handle the error if the user information update fails
				console.error('User information update failed:', error);
			},
		});
	}
}