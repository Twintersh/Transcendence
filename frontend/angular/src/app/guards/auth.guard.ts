import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> => {
	const authService = inject(AuthService);
	const router = inject(Router);
   
	return authService.isAuth().pipe(
		map(isAuthenticated => {
			if (isAuthenticated) {
				return true;
			} else {
				return router.createUrlTree(['/']);
			}
		})
	);
};
