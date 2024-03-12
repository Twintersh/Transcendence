import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FriendService } from 'src/app/services/friend.service';
import { ToastService } from 'src/app/services/toast.service';

import { User } from 'src/app/models/user.model';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { Subscription } from 'rxjs';


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

	subscription: Subscription = new Subscription();

	@Output() friendSelected: EventEmitter<User> = new EventEmitter<User>();

	constructor(
		private readonly friendService: FriendService,
		private readonly fb: FormBuilder,
		private readonly toastService: ToastService,
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
		this.subscription.add(
			this.friendService.addFriend(this.myForm.value).subscribe({
				next: (res: any) => {
					this.toastService.showSuccess('Friend request sent.');
					this.myForm.reset();
					this.friendService.getSentFriendRequests();
				},
				error: (err: any) => {
					if (err.status === 404) {
						this.toastService.showError('User does not exist.');
					}
					else
						this.toastService.showError(err.error);
				}
			})
		);
	}

	acceptFriend(username: string): void {
		this.subscription.add(
			this.friendService.acceptFriendRequest(username).subscribe({
				next: (res: any) => {
					this.toastService.showSuccess('Friend request accepted.');
					this.friendService.getReceivedFriendRequests();
					this.friendService.getUserFriends();
				},
				error: (err: any) => {
					this.toastService.showError('Failed to accept friend request.');
				}
			})
		);
	}

	toUserProfile(friend: User): void {
		if (friend) {
			this.offcanvas.dismiss();
			this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
				this.router.navigate(['/user/' + friend.id]);
			});
		}
	}

	toChat(friend: User): void {
		if (friend) {
			this.offcanvas.dismiss();
			this.router.navigateByUrl('/chat');
		}
	}

	isBlocked(friend: User): boolean {
		let blockedBool: boolean = false;
		this.blockedUsers.forEach((item: User) => {
		if (item.username === friend.username) 
			blockedBool = true;
		});

		return blockedBool;
	}

	blockUser(friend: User): void {
		if (friend) {
			this.subscription.add(
				this.friendService.blockFriend(friend).subscribe({
					next: (res: any) => {
						this.toastService.showSuccess('Friend blocked successfuly.');
						this.friendService.blockFriend(friend);
					},
					error: (err: any) => {
						this.toastService.showError('Failed to block friend.');
					}
				})
			);
		}
	}		

	unBlockUser(friend: User): void {
		if (friend) {
			this.subscription.add(
				this.friendService.unBlockFriend(friend).subscribe({
					next: (res: any) => {
						this.toastService.showSuccess('Friend unblocked successfuly.');
						this.friendService.unBlockFriend(friend);
					},
					error: (err: any) => {
						this.toastService.showError('Failed to unblock friend.');
					}
				})
			);
		}
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}
}