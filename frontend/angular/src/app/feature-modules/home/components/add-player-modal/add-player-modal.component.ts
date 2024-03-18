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
	private tournament: boolean = false;
	private tournamentPlayers: string[] = [];
	
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
		if (!this.myForm.valid) {
			this.toastService.showInfo('Please enter a username');
			return;
		}
		if (!this.tournament)
			this.ngbActiveModal.close(this.myForm.value.username);
		else {
			this.tournamentPlayers.push(this.myForm.value.username);
			this.myForm.reset();
			if (this.tournamentPlayers.length === 3)
				this.ngbActiveModal.close(this.tournamentPlayers);
		}
	}

	leaveMatch(): void {
		this.myForm.reset();
		this.ngbModal.dismissAll('Leave match');
	}
}
