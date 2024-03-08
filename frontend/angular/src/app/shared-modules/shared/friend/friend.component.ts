import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Component, NgModule, OnInit, EventEmitter, Output } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FriendService } from 'src/app/services/friend.service';
import { ToastService } from 'src/app/services/toast.service';
import { UserService } from 'src/app/services/user.service';

import { User } from 'src/app/models/user.model';


import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-friend',
  standalone: true,
  imports: [
	CommonModule,
	NgbModule,
	FormsModule,
	ReactiveFormsModule
	],
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.scss']
})
export class FriendComponent implements OnInit {
	myForm: FormGroup;
	friends: User[] = [];
	blockedUsers: User[] = [];
	rcvdRequests: any[] = [];
	sentRequests: any[] = [];

	offCollapsed = true;
	pendingCollapsed = true;

	@Output() friendSelected: EventEmitter<User> = new EventEmitter<User>();

	constructor(
		private readonly friendService: FriendService,
		private readonly fb: FormBuilder,
		private readonly toastService: ToastService,
		private readonly userService: UserService,
		private readonly offcanvas: NgbOffcanvas,
		private readonly router: Router
	) {
		this.myForm = this.fb.group({
			username: new FormControl('', Validators.required)
		});
	}
	
	ngOnInit(): void {
		this.friendService.friends$.subscribe((res: any) => {
			this.friends = res;
		});
		this.friendService.rcvdRequests$.subscribe((res: any) => {
			this.rcvdRequests = res;
		});
		this.friendService.sentRequests$.subscribe((res: any) => {
			this.sentRequests = res;
		});
		this.friendService.getBlockedUsers().subscribe((res: any) => {
			this.blockedUsers = res;
			console.log(this.blockedUsers);
		});
	}


  
	onSelect(friend: User) {
		if(!this.isBlocked(friend))
			this.friendSelected.emit(friend);
	}
  

	addFriend(): void {
		if (this.myForm.invalid) {
			this.toastService.showInfo('Please enter a username.');
			return;
		}
		this.friendService.addFriend(this.myForm.value).subscribe(
			(res: any) => {
				this.toastService.showSuccess('Friend request sent.');
				this.myForm.reset();
				this.friendService.getSentFriendRequests();
			},
			(err: any) => {
				if (err.status === 404) {
					this.toastService.showError('User does not exist.');
				}
				else if (err.err === 'Cannot send friend request to friend') {
					this.toastService.showError('You are already friends with this user.');
				}
				else if (err.error === "Cannot send friend request to yourself") {
					this.toastService.showError('You cannot add yourself as a friend.');
				}
				else if (err.status === 304) {
					this.toastService.showInfo('Friend request already sent.');
				}
		});
	}

	acceptFriend(username: string): void {
		this.friendService.acceptFriendRequest(username).subscribe(
			(res: any) => {
				this.toastService.showSuccess('Friend request accepted.');
				this.friendService.getReceivedFriendRequests();
				this.friendService.getUserFriends();
			},
			(err: any) => {
				this.toastService.showError('Failed to accept friend request.');
			}
		);
	}

	toUserProfile(friend: User): void {
		if (friend) {
			this.offcanvas.dismiss();
			this.router.navigateByUrl('/user/' + friend.id);
		}
	}

	toChat(friend: User): void {
		if (friend) {
			this.offcanvas.dismiss();
			this.router.navigateByUrl('/chat');
		}
	}




	isBlocked(friend: User): boolean {

		let toto: boolean = false;
		this.blockedUsers.forEach((item: User) => {
		if (item.username === friend.username) 
			toto = true;
		});

		return toto;
	}

	blockUser(friend: User): void {
		if (friend) {

			this.friendService.blockFriend(friend).subscribe(
				(res: any) => {
					this.toastService.showSuccess('Friend blocked successfuly.');
					
					this.friendService.blockFriend(friend);
				},
				(err: any) => {
					this.toastService.showError('Failed to block friend.');
				}
			);
		}
	}



	unBlockUser(friend: User): void {
		if (friend) {

			this.friendService.unBlockFriend(friend).subscribe(
				(res: any) => {
					this.toastService.showSuccess('Friend blocked successfuly.');
					
					this.friendService.unBlockFriend(friend);
				},
				(err: any) => {
					this.toastService.showError('Failed to block friend.');
				}
			);
		}
	}


}
