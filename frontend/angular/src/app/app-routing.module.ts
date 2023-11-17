import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './feature-modules/home/components/home/home.component';
import { LandingComponent } from './feature-modules/landing/components/landing/landing.component';
import { PageNotFoundComponent } from './core-modules/shell/pagenotfound/pagenotfound.component';
import { UserProfileComponent } from './feature-modules/user/components/user-profile/user-profile.component';

const routes: Routes = [
	{ path: 'home', component: HomeComponent },
	{ path: 'landing', component: LandingComponent },
	{ path: 'user', component: UserProfileComponent},
	{ path: '', redirectTo: '/landing', pathMatch: 'full' },
	{ path: '**', component: PageNotFoundComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
