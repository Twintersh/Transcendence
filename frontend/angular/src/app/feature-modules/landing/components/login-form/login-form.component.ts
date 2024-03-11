import { Component} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from 'src/app/services/auth.service';
import { CookieService } from 'src/app/services/cookie.service';
import { ToastService } from 'src/app/services/toast.service';
import { UserService } from 'src/app/services/user.service';


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
			console.log(this.myForm.value);
			this.authService.login(this.myForm.value).subscribe({
				next: (res: any) => {
					console.log('res is login ', res);
					this.cookieService.saveCookie('authToken', res.token);
					this.myForm.reset();
					this.modalService.dismissAll();
					this.authService.nextValue(true);
					// this.router.navigateByUrl('/home');
					this.router.navigate(['home'])
					this.toastService.showSuccess('Login successful');
				},
				error: () => {
					this.toastService.showError('Login unsuccessful');
				}
			});
	}};

	close(): void {
		this.modalService.dismissAll();
	}
}