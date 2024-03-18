import { Component} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from 'src/app/services/auth.service';
import { CookieService } from 'src/app/services/cookie.service';
import { ToastService } from 'src/app/services/toast.service';
import { UserService } from 'src/app/services/user.service';

import { NavbarComponent } from '../../../../shared-modules/shared/navbar/navbar.component';


@Component({
	selector: 'login-form',
	templateUrl: './login-form.component.html',
	styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent {

	myForm: FormGroup;

	constructor(
		private fb: FormBuilder, 
		private authService: AuthService, 
		private cookieService: CookieService, 
		private router: Router, 
		private toastService: ToastService,
		private modalService: NgbModal,
		private userService: UserService
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
	}​

	submitHandler(): void {
		if(this.myForm.valid) {
			this.authService.login(this.myForm.value).subscribe({
				next: (res: any) => {
					this.authService.nextValue(true);
					this.cookieService.saveCookie('authToken', res.token);
					this.modalService.dismissAll();
					this.router.navigate(['/home']);
					this.toastService.showSuccess('Login successful');
				},
				error: (err: any) => {
					if(err.status === 404) {
						this.toastService.showError('User not found');
					}
					else {
						this.toastService.showError(err.error);
					}
				}
			});
	}};

	close(): void {
		this.modalService.dismissAll();
	}
}