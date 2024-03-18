import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ChatComponent } from './components/chat/chat.component';
import { MessagesComponent } from './components/messages/messages.component';
import { FriendComponent } from 'src/app/shared-modules/shared/friend/friend.component';

@NgModule({
  declarations: [
	ChatComponent,
	MessagesComponent
  ],
  imports: [
	CommonModule,
	FormsModule,
	FriendComponent,
	ReactiveFormsModule
  ]
})
export class ChatModule { }
