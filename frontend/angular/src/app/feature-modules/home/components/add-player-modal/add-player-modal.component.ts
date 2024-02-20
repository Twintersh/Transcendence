import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ToastService } from 'src/app/services/toast.service';
import { WebSocketService } from 'src/app/services/websocket.service';


@Component({
  selector: 'app-add-player-modal',
  templateUrl: './add-player-modal.component.html',
  styleUrls: ['./add-player-modal.component.scss']
})
export class AddPlayerModalComponent {

	myForm: FormGroup;
	
	constructor(
		private fb: FormBuilder,
		private toastService: ToastService,
		private ngbModal: NgbModal,
		public readonly ngbActiveModal: NgbActiveModal,
	) {
		this.myForm = this.fb.group({
			username: new FormControl('', Validators.required)
		});
	}

	addPlayer(): void {
		if (!this.myForm.valid)
			this.toastService.showInfo('Please enter a username');
		this.ngbActiveModal.close(this.myForm.value.username);
	}

	leaveMatch(): void {
		this.myForm.reset();
		this.ngbModal.dismissAll();
	}
}
