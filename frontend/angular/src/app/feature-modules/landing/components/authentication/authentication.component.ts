import { Component } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { CookieService } from 'src/app/services/cookie.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';

import { LoginFormComponent } from '../login-form/login-form.component';

@Component({
	selector: 'authentication',
	templateUrl: './authentication.component.html',
	styleUrls: ['./authentication.component.scss'],
})
export class AuthenticationComponent {

	myForm: FormGroup;
	signingUp: boolean = false;

	constructor(
		private fb: FormBuilder,
		private readonly http: HttpClient,
		private authService: AuthService,
		private cookieService: CookieService,
		private router: Router,
		private modalService: NgbModal,
		private toastr: ToastrService
	) {
		this.myForm = this.fb.group({
			email: new FormControl('', Validators.email),
			username: new FormControl('', Validators.required),
			password : new FormControl('', [Validators.required, 
				Validators.minLength(4)]),
			confirmPassword : new FormControl('', [Validators.required, 
				Validators.minLength(4)])
		});
	}

	get email(): FormControl {
		return this.myForm.get('email') as FormControl;
	}
	
	login(): void {
		this.modalService.dismissAll();
		this.modalService.open(LoginFormComponent, { centered: true });
	}
	
	sign42(): void {
		this.modalService.dismissAll();
		this.authService.signup42();
	}
	
	signUp(): void {
		this.signingUp = true;
	}

	submitHandler(): void {
		if(this.myForm.valid) {
			this.authService.signup(this.myForm.value).subscribe({
				next: (response) => {
					const token: string = JSON.parse(JSON.stringify(response)).token;
					this.cookieService.saveCookie('authToken', token);
					this.modalService.dismissAll();
					this.authService.nextValue(true);
					this.router.navigateByUrl('/home');
					this.toastr.success('Welcome to the community!', 'Success');
				},
				error: (error) => {
					if (error.status == 400)
						this.toastr.error('Account already exists', 'Error');
				}
			});
		}
	}

	close(): void {
		this.modalService.dismissAll();
	}
}