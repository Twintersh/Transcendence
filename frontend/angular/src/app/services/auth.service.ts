import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { CookieService } from './cookie.service';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

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

		return this.http.post('http://127.0.0.1:8000/users/login/', loginData, { headers }).pipe(
			map((response: any) => {
				this.cookieService.saveCookie('authToken', response.token);
				console.log('Login successful');
				return response;
			}),
			catchError((error) => {
				console.error('Login failed', error);

			// Check if the error response contains validation errors
			if (error.error && typeof error.error === 'object') {
				// Handle validation errors and display them to the user
				console.log('Validation Errors:', error.error);
			}

			throw error;
			})
		);
	}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
		return this.isAuth();
	}

	public isAuth(): Observable<boolean> {
		const token = this.cookieService.getCookie('authToken');
		const headers = new HttpHeaders().set('Authorization', `Token ${token}`);
		
		return this.http.get<boolean>('http://127.0.0.1:8000/users/isAuth/', { headers }).pipe(
			map(() => {
				console.log('User is authenticated');
				return true;}), // If the request succeeds, the user is authenticated
			catchError(() => {
				// If there's an error (e.g., not authenticated), navigate to the landing page
				console.log('User is not authenticated');
				this.router.navigate(['/landing']);
				return of(false);
			})
		);
	}
}
