import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { OAuthModule } from 'angular-oauth2-oidc';

import { LandingModule } from './feature-modules/landing/landing.module';
import { UserModule } from './feature-modules/user/user.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './feature-modules/home/components/home/home.component';
import { SharedModule } from './shared-modules/shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    OAuthModule.forRoot(),
    LandingModule,
    NgbModule,
    UserModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
