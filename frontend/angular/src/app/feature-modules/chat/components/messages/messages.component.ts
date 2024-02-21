import { Component, Input, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';

import { User } from 'src/app/models/user.model';

import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
	@Input() friend!: User;
	@Input() messages?: string[];

	private roomId = '';

	constructor(
		private readonly chatService: ChatService
	) { }

	ngOnInit(): void {
	}

	ngOnChanges(): void {
		this.getRoomName();
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
