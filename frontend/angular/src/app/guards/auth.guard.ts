import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { of } from 'rxjs';

import { AuthService } from '../services/auth.service';



export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any => {
	const authService = inject(AuthService);

	if (authService.isAuthSubject === true) {
		return true;
	}
	else {
		authService.isAuth$.subscribe((res: boolean) => {
			if (res) {
				return of(true);
			}
			else {
				return of(false);
			}
		});
	}
};