import { Component, Input, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';

import { User } from 'src/app/models/user.model';

import { Subject } from 'rxjs';

import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
	@Input() friend!: User;
	private messages$: Subject<any> = new Subject<any>();
	readonly messages: string[] = [];

	private roomId = '';

	constructor(
		private readonly chatService: ChatService
	) { }

	ngOnInit(): void {
		this.chatService.getMessages().subscribe((message: any) => {
			this.messages$.next(message);
			this.messages.push(message);
		});
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

	sendMessage(message: string): void {
		console.log('Sending message:', message);
	}

	ngOnDestroy(): void {
		this.roomId = '';
		this.friend = {} as User;
	}
}
