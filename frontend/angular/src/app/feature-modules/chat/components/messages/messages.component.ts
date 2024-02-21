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
	@Input() friend?: User;
	@Input() messages?: string[];

	constructor(
		private readonly chatService: ChatService
	) { }

	ngOnInit(): void {
		console.log(this.friend);
	}
}
