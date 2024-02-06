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
	friends: any[] = [];
	testfriends: User[] = [ { id: 1, username: 'test', avatar: 'test', isActive: true },
							{ id: 2, username: 'test2', avatar: 'test2', isActive: false},
							{ id: 3, username: 'test3', avatar: 'test3', isActive: true},
							{ id: 4, username: 'test4', avatar: 'test4', isActive: false}
	];
	subscription: Subscription = new Subscription();
	isCollapsed = true;

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
		this.subscription = this.friendService.getUserFriends().subscribe((res: any) => {
			console.log(res);
		});
	}

	addFriend(): void {
		if (this.myForm.invalid) {
			this.toastService.showInfo('Please enter a username.');
			return;
		}
		this.friendService.addFriend(this.myForm.value).subscribe((res: any) => {
			console.log(res);
		});
		console.log(this.myForm.value);
		console.log('add friend');
	}
}
