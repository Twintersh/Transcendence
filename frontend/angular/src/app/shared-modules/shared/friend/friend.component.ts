import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';

import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

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

	FriendSubscription: Subscription = new Subscription();
	rcvdRequestSubscription: Subscription = new Subscription();
	sentRequestsSubscription: Subscription = new Subscription();
	offCollapsed = true;
	pendingCollapsed = true;

	constructor(
		private readonly friendService: FriendService,
		private readonly collapse: NgbCollapseModule,
		private readonly fb: FormBuilder,
		private readonly toastService: ToastService
	) {
		this.myForm = this.fb.group({
			username: new FormControl('', Validators.required)
		});
	}
	
	ngOnInit(): void {
		this.FriendSubscription = this.friendService.getUserFriends().subscribe((res: any) => {
			this.friends = res;
		});

		this.rcvdRequestSubscription = this.friendService.getReceivedFriendRequests().subscribe((res: any) => {
			this.rcvdRequests = res;
		});

		this.sentRequestsSubscription = this.friendService.getSentFriendRequests().subscribe((res: any) => {
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
			},
			(err: any) => {
				if (err.status === 404) {
					this.toastService.showError('User does not exist.');
				}
				else if (err.status === 403) {
					this.toastService.showError('You are already friends with this user.');
				}
				else if (err.error === "You can't send a friend request to yourself") {
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
				console.log("res is ", res);
				this.toastService.showSuccess('Friend request accepted.');
			},
			(err: any) => {
				console.log("err is ", err);
		}
		);
	}
}
