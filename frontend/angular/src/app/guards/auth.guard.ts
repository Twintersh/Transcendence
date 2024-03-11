import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';

import { Observable, of } from 'rxjs';

import { AuthService } from '../services/auth.service';



export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
	const authService = inject(AuthService);

	console.log(authService.isAuthSubject)

	return true;
};	
