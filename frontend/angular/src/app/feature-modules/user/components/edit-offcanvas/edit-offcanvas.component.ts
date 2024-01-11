import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-edit-offcanvas',
  templateUrl: './edit-offcanvas.component.html',
  styleUrls: ['./edit-offcanvas.component.scss']
})
export class EditOffcanvasComponent {
	editForm: FormGroup;

	constructor(private readonly offcanvas: NgbOffcanvas, private fb: FormBuilder, private readonly http: HttpClient, private userService: UserService) {
		this.editForm = this.fb.group({
			username: new FormControl('', [Validators.minLength(4), Validators.maxLength(20)]),
			password : new FormControl('', [Validators.minLength(4), Validators.maxLength(20)]),
			confirmPassword : new FormControl('', [Validators.minLength(4), Validators.maxLength(20)])
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
			console.log(this.editForm.value);
			this.userService.updateUserInfos(this.editForm.value);
		}
	}

	updateAvatar(event: any): void {
		console.log(event.target.files[0]); // outputs the first file
		const formData = new FormData();
		formData.append('file', event.target.files[0]);
		this.userService.updateProfilePicture(formData);
	}
}
