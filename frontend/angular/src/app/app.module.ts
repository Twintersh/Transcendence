import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './feature-modules/home/components/home/home.component';
import { LandingModule } from './feature-modules/landing/landing.module';
import { PageNotFoundComponent } from './core-modules/pagenotfound/pagenotfound.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
	PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
	LandingModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
