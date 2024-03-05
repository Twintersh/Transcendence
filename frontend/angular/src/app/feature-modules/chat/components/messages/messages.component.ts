import { Component, Input, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';

import { User } from 'src/app/models/user.model';
import { Message } from 'src/app/models/chat.model';

import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
	@Input() friend!: User;
	messages: Message[] = [];

	private roomId = '';

	constructor(
		private readonly chatService: ChatService,
	) { }

	ngOnInit(): void {
		this.chatService.messages$.subscribe((message: Message[]) => {
			this.messages = message;
		});

	}

	ngOnChanges(): void {



		this.getRoomName();
		//this.messages = [];
		//this.friend = {} as User;


		// VVVV TO DO WHEN CHANGING SELECTED FRIEND VVVV
		// this.chatService.disconnectChat();



	}
	
	getRoomName(): void {
		if (this.friend.username) {
			this.chatService.getRoomName(this.friend?.username).subscribe((res: any) => {
				if (res.hasOwnProperty('room_id')) {
					this.roomId = res.room_id;
					this.chatService.connectChat(this.roomId);
				}
			});
		}
	}

	ngOnDestroy(): void {
		this.roomId = '';
		this.friend = {} as User;
	}
}
