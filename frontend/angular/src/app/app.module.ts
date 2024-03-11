import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OAuthModule } from 'angular-oauth2-oidc';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { LandingModule } from './feature-modules/landing/landing.module';
import { UserModule } from './feature-modules/user/user.module';
import { SharedModule } from './shared-modules/shared/shared.module';
import { ChatModule } from './feature-modules/chat/chat.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './feature-modules/home/components/home/home.component';
import { QueueModalComponent } from './feature-modules/home/components/queue-modal/queue-modal.component';
import { AddPlayerModalComponent } from './feature-modules/home/components/add-player-modal/add-player-modal.component';
import { WinModalComponent } from './feature-modules/game/components/win-modal/win-modal.component';
import { NavbarComponent } from './shared-modules/shared/navbar/navbar.component';
import { authGuard } from './guards/auth.guard';

@NgModule({
	declarations: [
		AppComponent,
		HomeComponent,
		QueueModalComponent,
		AddPlayerModalComponent,
		WinModalComponent
	],
	imports: [
		NavbarComponent,
		HttpClientModule,
		BrowserModule,
		BrowserAnimationsModule,
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		AppRoutingModule,
		OAuthModule.forRoot(),
		ToastrModule.forRoot(),
		LandingModule,
		NgbModule,
		UserModule,
		SharedModule,
		ChatModule
	],
	providers: [
	],
	bootstrap: [AppComponent]
	})
export class AppModule { }
