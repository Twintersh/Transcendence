import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, map, of, catchError, BehaviorSubject } from 'rxjs';

import { CookieService } from './cookie.service'; 

import { User } from '../models/user.model';
import { HTTP_MODE, IP_SERVER } from '../../env';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
	public _isAuthSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	public isAuth$: Observable<boolean> = this._isAuthSubject.asObservable();
	public isAuthValue: boolean = false;

	
	constructor (
		private readonly http: HttpClient,
		private readonly cookieService: CookieService,
	) {
		this.isAuth().subscribe((res: boolean) => {
			this.isAuthValue = res;
		});
	}
		
	get isAuthSubject() {
		return this._isAuthSubject.value;
	}

	public nextValue(value: boolean) {
		this._isAuthSubject.next(value);
		this.isAuthValue = value;
		if (value === false) {
			this.cookieService.deleteCookie('authToken');
		}
	}

  	public signup(newUser: User) {
		return this.http.post(HTTP_MODE + IP_SERVER + '/users/signup/', newUser);
	}	

	public signup42() {
		const url: string = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-07f2dcaa8cb3bea2fc596723d624d6d09f0e930ed9b35c5d9b30f5a1159b7cce&redirect_uri=http%3A%2F%2F127.0.0.1%3A8000%2Fusers%2Fsignup42&response_type=code';
		document.location.href = url;
	}

	public logout(): Observable<boolean> {
		const token = this.cookieService.getCookie('authToken');
		const headers = new HttpHeaders().set('Authorization', `Token ${token}`);

		return this.http.get<boolean>(HTTP_MODE + IP_SERVER + '/users/logout/', { headers });
	}

	public login(loginData: { email: string; password: string }): Observable<any> {
		const headers = new HttpHeaders();

		return this.http.post(HTTP_MODE + IP_SERVER + '/users/login/', loginData, { headers });
	}

	public isAuth(): Observable<boolean> {
		const token = this.cookieService.getCookie('authToken');
		const headers = new HttpHeaders().set('Authorization', `Token ${token}`);

		if (token === undefined || token === '' || token === null) {
			this.nextValue(false);
			return of(false);
		}
	
		return this.http.get<boolean>(HTTP_MODE + IP_SERVER + '/users/isAuth/', { headers }).pipe(
			map(res => {
				this.nextValue(true);
				return true;
			}),
			catchError(() => {
				console.log('isAuth error');
				this.nextValue(false);
				return of(false);
			})
		);
	}
}
