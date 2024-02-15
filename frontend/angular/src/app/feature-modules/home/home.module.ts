import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { QueueModalComponent } from './components/queue-modal/queue-modal.component';
import { HomeComponent } from './components/home/home.component';



@NgModule({
  declarations: [
	HomeComponent,
    QueueModalComponent
  ],
  imports: [
    CommonModule,
	BrowserModule
  ]
})
export class HomeModule { }
