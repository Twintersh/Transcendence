import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
	myForm: FormGroup;

	constructor(private fb: FormBuilder) {
		this.myForm = new FormGroup({});
	}

	ngOnInit(): void {
		this.myForm = this.fb.group({
			email: '',
			username: '',
			password: '',
			confirmPassword: '',
		});

		this.myForm.valueChanges.subscribe(console.log);
	}

	submitHandler(): void {
		console.log(this.myForm.value);
	}
}
