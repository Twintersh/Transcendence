import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { CookieService } from './cookie.service';
import { catchError, map } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

	constructor(private readonly http: HttpClient, private readonly cookieService: CookieService, private readonly router: Router) {

	}

  	public signup(newUser: User) {
		return this.http.post('http://127.0.0.1:8000/users/signup/', newUser)
	}	

	public signup42(newUser: User) {
		return this.http.post('http://127.0.0.1:8000/users/sign42/', newUser)
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
			return of(false);
		}

		return this.http.get<boolean>('http://127.0.0.1:8000/users/isAuth/', { headers }).pipe(
			catchError((error) => {
				if (error.status === 403) {
					console.log('Unauthorized error. Redirecting to landing page...');
					this.router.navigate(['']);
				}
				return of(false);
			})
		);
	}
}
