import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';

import { User } from 'src/app/models/user.model'

import { FriendService } from 'src/app/services/friend.service';
import { UserService } from 'src/app/services/user.service';
import { ChatService } from 'src/app/services/chat.service';

import { MessagesComponent } from '../messages/messages.component';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
	friends: User[] = [];
	FriendSubscription: Subscription = new Subscription();
	myForm: FormGroup;
	selectedFriend!: User;

	constructor(
		private readonly fb: FormBuilder,
		private readonly friendService: FriendService,
		private readonly userService: UserService,
		private readonly chatService: ChatService
	) { 
		this.myForm = this.fb.group({
			message: new FormControl('', Validators.required)
		});
	}

	sendMessage(): void {
		if (this.myForm.invalid) {
			return;
		}
		this.chatService.sendMessage(this.myForm.value);
		this.myForm.reset();
	}

	onSelect(friend: User): void {
		this.selectedFriend = friend;
	}
}