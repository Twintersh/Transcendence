import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { CookieService } from 'src/app/services/cookie.service';

@Component({
	selector: 'signup-form',
	templateUrl: './signup-form.component.html',
	styleUrls: ['./signup-form.component.scss'],
})
export class SignUpFormComponent {

	myForm: FormGroup;

	constructor(private fb: FormBuilder, private readonly http: HttpClient, private authService: AuthService, private cookieService: CookieService) {
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
	}​

	submitHandler(): void {
		if(this.myForm.valid) {
			this.authService.signup(this.myForm.value).subscribe( (data) => {
				if (data) {
					const token: string = JSON.parse(JSON.stringify(data)).token;
					this.cookieService.saveCookie('authToken', token);
					window.location.href = '/home';
				}
				console.log(this.cookieService.getCookie('authToken'));
			})
		}
	}
}
