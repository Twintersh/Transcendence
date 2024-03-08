import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';

import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree => {
	const authService = inject(AuthService);
	const router = inject(Router);
	const isAuth = authService.isAuthSubject;

	console.log('isAuth:', isAuth);
	if (isAuth) {
		return true;
	} else {
		return router.createUrlTree(['/']);
	}
};
