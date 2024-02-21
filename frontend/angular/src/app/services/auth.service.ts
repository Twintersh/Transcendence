import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';

import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { CookieService } from './cookie.service'; 
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

	constructor(private readonly http: HttpClient, private readonly cookieService: CookieService, private readonly router: Router) {
	}

  	public signup(newUser: User) {
		return this.http.post('http://127.0.0.1:8000/users/signup/', newUser)
	}	

	public signup42() {
		console.log('signup42');
		const url: string = 'https://api.intra.42.fr/v2/oauth/authorizeclient_id=u-s4t2ud-07f2dcaa8cb3bea2fc596723d624d6d09f0e930ed9b35c5d9b30f5a1159b7cce&redirect_uri=http://127.0.0.1:8000/users/signup42/&response_type=code';
		this.router.navigateByUrl(url);
	}

	public logout(): void {
		console.log('logout');
		const token = this.cookieService.getCookie('authToken');
		const headers = new HttpHeaders().set('Authorization', `Token ${token}`);
		this.http.get<any>('http://127.0.0.1:8000/users/logout/', { headers }).subscribe({
			next: () => {
			  this.cookieService.deleteCookie('authToken');
			  console.log('Logout successful');
			},
			error: (error) => {
			  // Error: Handle the error if the logout fails
			  console.error('Logout failed:', error);
			},
		});
	}

	login(loginData: { email: string; password: string }): Observable<any> {
		const headers = new HttpHeaders();

		return this.http.post('http://127.0.0.1:8000/users/login/', loginData, { headers });
	}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
		return this.isAuth();
	}

	public isAuth(): Observable<boolean> {
		const token = this.cookieService.getCookie('authToken');
		const headers = new HttpHeaders().set('Authorization', `Token ${token}`);
		
		if (!token) {
			this.router.navigate(['/']);
			return of(false);
		}

		return this.http.get<boolean>('http://127.0.0.1:8000/users/isAuth/', { headers }).pipe(
			catchError((error) => {
				if (error.status === 403) {
					console.log('Unauthorized error. Redirecting to landing page...');
					this.router.navigate(['/']);
				}
				return of(false);
			})
		);
	}
}
