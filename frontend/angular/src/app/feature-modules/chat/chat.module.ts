import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ChatComponent } from './components/chat/chat.component';
import { MessagesComponent } from './components/messages/messages.component';

@NgModule({
  declarations: [
	ChatComponent,
 	MessagesComponent
  ],
  imports: [
    CommonModule,
	FormsModule,
	ReactiveFormsModule
  ]
})
export class ChatModule { }
