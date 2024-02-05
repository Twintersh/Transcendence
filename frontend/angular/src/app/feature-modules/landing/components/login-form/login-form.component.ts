import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';
import { CookieService } from 'src/app/services/cookie.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
	selector: 'login-form',
	templateUrl: './login-form.component.html',
	styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit {

	myForm: FormGroup;

	constructor(
		private fb: FormBuilder, 
		private authService: AuthService, 
		private cookieService: CookieService, 
		private router: Router, 
		private toastService: ToastService
	) {
		this.myForm = this.fb.group({
			email: ['', Validators.required,Validators.email],
			password : ['', Validators.required, Validators.minLength(4)]
		});
	}

	get email() {
		return this.myForm.get('email') as FormControl;
	}

	get password() {
		return this.myForm.get('password') as FormControl;
	}

	ngOnInit(): void {
	}​

	submitHandler(): void {
		console.log(this.myForm.value);
		if(this.myForm.valid) {
			this.authService.login(this.myForm.value).subscribe({
				next: (response) => {
					this.cookieService.saveCookie('authToken', response.token);
					this.toastService.showSuccess('Login successful');
					this.myForm.reset();
					this.router.navigate(['/home']);
				},
				error: (error) => {
					if (error.status == 400)
						this.toastService.showError('Wrong password');
					if (error.status == 404)
						this.toastService.showError('Wrong email');
				}
			}
		)};
	}
}