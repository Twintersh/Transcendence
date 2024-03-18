import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './feature-modules/home/components/home/home.component';
import { LandingComponent } from './feature-modules/landing/components/landing/landing.component';
import { PageNotFoundComponent } from './shared-modules/shared/pagenotfound/pagenotfound.component';
import { UserProfileComponent } from './feature-modules/user/components/user-profile/user-profile.component';
import { GameComponent } from './feature-modules/game/components/game/game.component';
import { ChatComponent } from './feature-modules/chat/components/chat/chat.component';
import { authGuard } from './guards/auth.guard';

const routes: Routes = [
	{ path: '', component: LandingComponent },
	{ path: 'home', component: HomeComponent, canActivate: [authGuard] },
	{ path: 'user/:userId', component: UserProfileComponent, canActivate: [authGuard] },
	{ path: 'game/:matchId', component: GameComponent, canActivate: [authGuard] },
	{ path: 'game/local/:matchId', component: GameComponent, canActivate: [authGuard] },
	{ path: 'game/tournament/:matchId', component: GameComponent, canActivate: [authGuard] },
	{ path: 'chat', component: ChatComponent, canActivate: [authGuard] },
	{ path: '**', component: PageNotFoundComponent, canActivate: [authGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
