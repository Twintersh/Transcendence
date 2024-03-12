import { Component, Input, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { User } from 'src/app/models/user.model';
import { Message } from 'src/app/models/chat.model';

import { ChatService } from 'src/app/services/chat.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { GameService } from 'src/app/services/game.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
	@Input() friend!: User;
	messages: Message[] = [];

	private roomId = '';
	private modal!: NgbModalRef;
	subscription: Subscription = new Subscription();

	constructor(
		private readonly chatService: ChatService,
		private readonly gameService: GameService,
		private readonly ngbModal: NgbModal,
		private readonly userService: UserService,
		private readonly router: Router
	) { }

	ngOnInit(): void {
		this.chatService.messages$.subscribe((message: Message[]) => {
			this.messages = message;
			this.checkInvite(this.messages);
		});
	}

	checkInvite(messages: Message[]) {
		messages.forEach((msg) => {
			if (msg.content.includes('/accept'))
			{
				let matchId: string = msg.content.slice(8);
				this.chatService.removeInvites(this.roomId).subscribe({
					next: (res: any) => {
						console.log(res);
					},
					error: () => {
					}
				});
				this.router.navigateByUrl('/game/' + matchId);
			}
		})
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
	
	acceptGameInvite(friend: User): void {
		var myUsername: string;
		this.subscription.add(
			this.userService.getUserInfos().subscribe({
				next: (user: User) => {
					myUsername = user.username;
					console.log(myUsername);
					this.gameService.getLocalMatch(myUsername, friend.username).subscribe({
						next: (res) => {
							let msg = {
								message: '/accept ' + res['id']
							}
							console.log('msg is ', msg);
							this.chatService.sendMessage(msg);
						},
						error: (error) => {
							console.error('Error:', error);
						}
						
					})
					
				}
			})
			);
	}
		
	ngOnDestroy(): void {
		this.roomId = '';
		this.friend = {} as User;
		this.subscription.unsubscribe();
	}
}