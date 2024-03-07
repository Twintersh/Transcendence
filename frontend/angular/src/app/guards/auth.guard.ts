import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';

import { Observable, map } from 'rxjs';

import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> => {
	const authService = inject(AuthService);
	const router = inject(Router);

	return authService.isAuth().pipe(
		map((isAuth) => {
			if (isAuth) {
				return true;
			} else {
				return router.createUrlTree(['/']);
			}
		})
	);
};
