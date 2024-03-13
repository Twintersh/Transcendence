import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';

import { Subscription } from 'rxjs';


import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { ChatService } from 'src/app/services/chat.service';
import { GameService } from 'src/app/services/game.service';
import { UserService } from 'src/app/services/user.service';

import { User } from 'src/app/models/user.model'

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

	private modal!: NgbModalRef;

	constructor(
		private readonly fb: FormBuilder,
		private readonly router: Router,
		private readonly gameService: GameService,
		private readonly userService: UserService,
		private readonly ngbModal: NgbModal,
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

	sendGameInvite(friend: User): void {
		this.myForm.value.message = "/invite";
		this.chatService.sendMessage(this.myForm.value);
	}

}