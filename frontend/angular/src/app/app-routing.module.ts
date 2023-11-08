import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './feature-modules/home/components/home/home.component';
import { LandingComponent } from './feature-modules/landing/components/landing/landing.component';
import { LoginModalComponent } from './feature-modules/landing/components/login-modal/login-modal.component';

const routes: Routes = [
	{path: 'home', component: HomeComponent },
	{path: 'landing', component: LandingComponent },
	{path: 'login', component: LoginModalComponent },
	{path: '**', redirectTo: 'landing' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
