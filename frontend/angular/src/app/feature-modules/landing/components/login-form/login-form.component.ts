import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/models/user.model';

@Component({
	selector: 'login-form',
	templateUrl: './login-form.component.html',
	styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit {

	myForm: FormGroup;

	constructor(private fb: FormBuilder, private readonly http: HttpClient) {
		this.myForm = this.fb.group({
			email: new FormControl('', Validators.email),
			username: new FormControl('', Validators.required),
			password : new FormControl('', [Validators.required, 
				Validators.minLength(4)]),
			confirmPassword : new FormControl('', [Validators.required, 
				Validators.minLength(4)])
		});
	}

	ngOnInit(): void {
	}​

	submitHandler(): void {
		const {email, username, password} = this.myForm.value;
		
		const newUser = {
			"username": username as string,
			"email": email as string,
			"password": password as string
		};

		const bibux = {
			"username" : "asdfsdfsdf",
			"email" : "sadfsadf@gmail.com",
			"password" : "moasdfsadfsadfmoyii" 
		}

		const test = JSON.stringify(newUser);
		console.log(test);
		const obs = this.http.post('http://127.0.0.1:8000/users/signup/', test);
		obs.subscribe( (data) => {
			console.log(data);
		});
	}
}
