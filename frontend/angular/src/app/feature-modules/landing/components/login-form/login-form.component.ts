import { Component, OnInit } from '@angular/core';
import { EmailValidator, FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
	myForm: FormGroup;
	

	constructor(private fb: FormBuilder) {
		this.myForm = new FormGroup({
			email: new FormControl(),
			username: new FormControl(),
			password : new FormControl(),
			confirmPassword : new FormControl(),
		});
	}

	ngOnInit(): void {
	}​

	submitHandler(): void {
		console.log(this.myForm.get('username'));
		console.log(this.myForm.value);
	}
}
