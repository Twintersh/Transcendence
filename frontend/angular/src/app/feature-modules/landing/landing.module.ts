import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './components/landing/landing.component';
import { LoginModalComponent } from './components/login-modal/login-modal.component';
import { LoginFormComponent } from './components/login-form/login-form.component';

@NgModule({
  declarations: [
    LandingComponent,
    LoginModalComponent,
	LoginFormComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
	LoginModalComponent,
	LoginFormComponent
  ]
})
export class LandingModule { }
