import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
	selector: 'login-form',
	templateUrl: './login-form.component.html',
	styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit {

	myForm: FormGroup;

	constructor(private fb: FormBuilder, private readonly http: HttpClient, private authService: AuthService) {
		this.myForm = this.fb.group({
			email: new FormControl('', Validators.email),
			username: new FormControl('', Validators.required),
			password : new FormControl('', [Validators.required, 
				Validators.minLength(4)]),
			confirmPassword : new FormControl('', [Validators.required, 
				Validators.minLength(4)])
		});
	}

	get email() {
		return this.myForm.get('email') as FormControl;
	}

	ngOnInit(): void {
	}​

	submitHandler(): void {
		if(this.myForm.valid) {
			this.authService.signup(this.myForm.value).subscribe( (data) => {
				console.log(data);
			})
		}
	}

	
}
