import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './components/landing/landing.component';
import { LoginModalComponent } from './components/login-modal/login-modal.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    LandingComponent,
    LoginModalComponent,
    LoginFormComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  exports: [
    LoginModalComponent,
    LoginFormComponent
  ]
})
export class LandingModule { }
