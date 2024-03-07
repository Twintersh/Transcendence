import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';

import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import { LocalDataManagerService } from 'src/app/services/local-data-manager.service';

@Component({
  selector: 'app-edit-offcanvas',
  templateUrl: './edit-offcanvas.component.html',
  styleUrls: ['./edit-offcanvas.component.scss']
})
export class EditOffcanvasComponent {
	editForm: FormGroup;
	subscription = new Subscription();

	@Input() avatar: string = '';

	constructor(
		private readonly offcanvas: NgbOffcanvas, 
		private fb: FormBuilder,
		private userService: UserService,
		private toastr: ToastrService,
		private localDataManager: LocalDataManagerService
	) {
		this.editForm = this.fb.group({
			username: [undefined, [Validators.minLength(4), Validators.maxLength(20)]],
			password : [undefined, [Validators.minLength(4), Validators.maxLength(20)]],
			confirmPassword : [undefined, [Validators.minLength(4), Validators.maxLength(20)]],
		});
	}

	get email() {
		return this.editForm.get('email') as FormControl;
	}
	
	close() {
		this.offcanvas.dismiss();
	}​

	submitHandler(): void {
		if(this.editForm.valid) {
			this.subscription.add(
				this.userService.updateUserInfos(this.editForm.value).subscribe({
					next: () => {
						this.toastr.success('User information updated');
						this.refreshUserInfos();
						this.offcanvas.dismiss();
					},
					error: (error) => {
						// Error: Handle the error if the user information update fails
						console.error('User information update failed:', error);
					},
				})
			)
		}
	}

	public refreshUserInfos(): void {
		this.userService.getUserInfos().subscribe({
			next: (user) => {
				this.userService.nextUserInfo(user);
				this.localDataManager.saveData('userName', user.username);
				this.localDataManager.saveData('userAvatar', user.avatar);
			},
			error: (error) => {
				// Error: Handle the error if the user information retrieval fails
				console.error('User information retrieval failed:', error);
			}
		});
	}

	updateAvatar(event: any): void {
		const formData = new FormData();
		formData.append('file', event.target.files[0]);
		if (event.target.files[0].size > 1000000) {
			// Error: Handle the error if the file size is too large
			this.toastr.error('File size is too large');
		}
		else if (event.target.files[0].type !== 'image/png' && event.target.files[0].type !== 'image/jpeg') {
			// Error: Handle the error if the file type is not supported
			this.toastr.error('File type is not supported');
		}
		else {
			// Success: Update the user's profile picture
			this.refreshUserInfos();
			this.userService.updateProfilePicture(formData);
			this.toastr.success('Profile picture updated');
		}
	}

	onDestroy() {
		this.subscription.unsubscribe();
	}
}
