import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError } from 'rxjs';

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
		private toastService: ToastService,
		private modalService: NgbModal,
		private activatedRoute: ActivatedRoute
	) {
		this.myForm = this.fb.group({
			email: new FormControl('', [Validators.required, Validators.email]),
			password : new FormControl('', [Validators.required, Validators.minLength(4)])
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
		if(this.myForm.valid) {
			this.authService.login(this.myForm.value).pipe(
				catchError((err) => {
					// this.modalService.showError("cant login");
					return err;
				})
			).subscribe((response) => {
					this.cookieService.saveCookie('authToken', response.token);
					this.toastService.showSuccess('Login successful');
					this.myForm.reset();
					this.modalService.dismissAll();
					this.router.navigate(['../home']);
				},
		)};
	}

	close(): void {
		this.modalService.dismissAll();
	}
}