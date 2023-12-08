import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { CookieService } from 'src/app/services/cookie.service';

@Component({
	selector: 'login-form',
	templateUrl: './login-form.component.html',
	styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit {

	myForm: FormGroup;

	constructor(private fb: FormBuilder, private readonly http: HttpClient, private authService: AuthService, private cookieService: CookieService) {
		this.myForm = this.fb.group({
			email: new FormControl('', Validators.email),
			password : new FormControl('', [Validators.required, 
				Validators.minLength(4)]),
		});
	}

	get email() {
		return this.myForm.get('email') as FormControl;
	}

	ngOnInit(): void {
	}​

	submitHandler(): void {
		console.log(this.myForm.value);
		if(this.myForm.valid) {
			this.authService.login(this.myForm.value).subscribe( (data) => {
				if (data) {
					console.log('Login successful');
					window.location.href = '/home';
				}
				console.log(this.cookieService.getCookie('authToken'));
			})
		}
	}
}