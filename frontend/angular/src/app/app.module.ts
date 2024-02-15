import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { OAuthModule } from 'angular-oauth2-oidc';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { LandingModule } from './feature-modules/landing/landing.module';
import { UserModule } from './feature-modules/user/user.module';

import { PongoInterceptor } from './interceptor/pongo.interceptor';

import { AppComponent } from './app.component';
import { HomeComponent } from './feature-modules/home/components/home/home.component';
import { SharedModule } from './shared-modules/shared/shared.module';
import { CommonModule } from '@angular/common';
import { ChatModule } from './feature-modules/chat/chat.module';
import { ToastrModule } from 'ngx-toastr';
import { QueueModalComponent } from './feature-modules/home/components/queue-modal/queue-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
	QueueModalComponent
  ],
  imports: [
    BrowserModule,
	BrowserAnimationsModule,
	CommonModule,
    AppRoutingModule,
    OAuthModule.forRoot(), // TODO: forRoot mandatory ?
	ToastrModule.forRoot(),
    LandingModule,
    NgbModule,
    UserModule,
    SharedModule,
	ChatModule
  ],
  providers: [
	PongoInterceptor
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
