import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './feature-modules/home/components/home/home.component';
import { LandingComponent } from './feature-modules/landing/components/landing/landing.component';
import { PageNotFoundComponent } from './shared-modules/shared/pagenotfound/pagenotfound.component';
import { UserProfileComponent } from './feature-modules/user/components/user-profile/user-profile.component';
import { ChatComponent } from './feature-modules/chat/components/chat/chat.component';
import { AuthService } from './services/auth.service';

const routes: Routes = [
	{ path: 'home', component: HomeComponent, canActivate: [AuthService] },
	{ path: 'landing', component: LandingComponent },
	{ path: 'user', component: UserProfileComponent, canActivate: [AuthService] },
	{ path: 'chat', component: ChatComponent, canActivate: [AuthService] },
	{ path: '**', component: PageNotFoundComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
