import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './components/landing/landing.component';
import { LoginModalComponent } from './components/login-modal/login-modal.component';


@NgModule({
  declarations: [
    LandingComponent,
    LoginModalComponent
  ],
  imports: [
    CommonModule
  ]
})
export class LandingModule { }
