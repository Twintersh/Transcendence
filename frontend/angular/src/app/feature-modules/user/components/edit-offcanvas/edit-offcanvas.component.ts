import { Component } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-offcanvas',
  templateUrl: './edit-offcanvas.component.html',
  styleUrls: ['./edit-offcanvas.component.scss']
})
export class EditOffcanvasComponent {
	constructor(private offcanvas: NgbOffcanvas) {
	}

	close() {
		this.offcanvas.dismiss();
	}
}
