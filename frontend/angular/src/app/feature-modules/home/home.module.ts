import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { QueueModalComponent } from './components/queue-modal/queue-modal.component';
import { HomeComponent } from './components/home/home.component';
import { AddPlayerModalComponent } from './components/add-player-modal/add-player-modal.component';



@NgModule({
  declarations: [
	HomeComponent,
    QueueModalComponent,
    AddPlayerModalComponent
  ],
  imports: [
    CommonModule,
	BrowserModule,
  ]
})
export class HomeModule { }
