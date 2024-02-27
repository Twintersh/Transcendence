import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { FriendService } from 'src/app/services/friend.service';
import { ToastService } from 'src/app/services/toast.service';
import { User } from 'src/app/models/user.model';


@Component({
  selector: 'app-friend',
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.scss']
})
export class FriendComponent implements OnInit {
	myForm: FormGroup;
	friends: User[] = [];
	rcvdRequests: any[] = [];
	sentRequests: any[] = [];

	offCollapsed = true;
	pendingCollapsed = true;

	constructor(
		private readonly friendService: FriendService,
		private readonly fb: FormBuilder,
		private readonly toastService: ToastService
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
}
