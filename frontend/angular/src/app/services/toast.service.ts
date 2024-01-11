import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
	providedIn: 'root',
})
export class ToastService {
	constructor(private toastr: ToastrService) {}

	showSuccess(message: string): void {
		this.toastr.success(message, 'Success', {
			closeButton: true,
			positionClass: 'toast-top-right',
			progressBar: true
		});
	}

	showError(message: string): void {
		this.toastr.error(message, 'Error', {
			closeButton: true,
			positionClass: 'toast-top-right',
			progressBar: true
		});
	}

	showInfo(message: string): void {
		this.toastr.info(message, 'Notification', {
			closeButton: true,
			positionClass: 'toast-top-right',
			progressBar: true
		});
	}
}