import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { Subscription } from 'rxjs';

import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-edit-offcanvas',
  templateUrl: './edit-offcanvas.component.html',
  styleUrls: ['./edit-offcanvas.component.scss']
})
export class EditOffcanvasComponent {
	editForm: FormGroup;
	subscription = new Subscription();

	constructor(
		private readonly offcanvas: NgbOffcanvas, 
		private fb: FormBuilder, 
		private readonly http: HttpClient, 
		private userService: UserService,
		private cd : ChangeDetectorRef
		)
	{
		this.editForm = this.fb.group({
			username: [undefined, [Validators.minLength(4), Validators.maxLength(20)]],
			password : [undefined, [Validators.minLength(4), Validators.maxLength(20)]],
			confirmPassword : [undefined, [Validators.minLength(4), Validators.maxLength(20)]],
			//
			avatar: undefined
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
			if (this.editForm.value.avatar) {
				console.log(this.editForm.value.avatar);
				// this.updateAvatar();
				// TODO: retour de fichier de avatar
			}
			console.log(this.editForm.value);
			// this.userService.updateUserInfos(this.editForm.value);
			this.subscription.add(
				this.userService.updateUserInfos(this.editForm.value).subscribe({
					next: () => {
						// this.userService.getUserInfos().subscribe({
						// 	next: (data) => {
						// 	},
						// 	error: (error) => {
						// 		console.error('Error fetching user information:', error);
						// 	}
						// });*
						this.cd.markForCheck(); // pour refresh
					},
					error: (error) => {
						// Error: Handle the error if the user information update fails
						console.error('User information update failed:', error);
					},
				})
			)
		}
	}

	updateAvatar(event: any): void {
		console.log(event.target.files[0]); // outputs the first file
		const formData = new FormData();
		formData.append('file', event.target.files[0]);
		this.userService.updateProfilePicture(formData);
	}
}
