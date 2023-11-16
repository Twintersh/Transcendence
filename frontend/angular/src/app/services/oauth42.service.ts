import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';

const OAuthConfig: AuthConfig = {
	issuer: 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-c3a119bea9c389c078428f5be35975fc98eabbf7a1cb01640eb419304569c09a&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Flanding&response_type=code',
	strictDiscoveryDocumentValidation: false,
	redirectUri: window.location.origin,
	clientId: 'u-s4t2ud-c3a119bea9c389c078428f5be35975fc98eabbf7a1cb01640eb419304569c09a',
	scope: 'openid profile email',
}

@Injectable({
  providedIn: 'root'
})
export class Oauth42Service {

  constructor(readonly OAuthService: OAuthService) {
		OAuthService.configure(OAuthConfig);
	}

	login(): void {
		this.OAuthService.loadDiscoveryDocument().then( () => {
			this.OAuthService.tryLoginImplicitFlow().then( () => {
				if (!this.OAuthService.hasValidAccessToken()) {
					this.OAuthService.initLoginFlow();
				} else {
					this.OAuthService.loadUserProfile().then( (userProfile) => {
						console.log(JSON.stringify(userProfile));
					})
				}
			});
		});	
	}
}
