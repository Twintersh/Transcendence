import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from '../../../../services/auth.service'
import { AuthenticationComponent } from '../authentication/authentication.component';

@Component({
  selector: 'landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})

export class LandingComponent implements OnInit {

	constructor(
		private authService: AuthService,
		private router: Router,
		private modalService: NgbModal
	) { }

	ngOnInit() {
		this.isAuth();
	}

	isAuth(): void {
		this.authService.isAuth().subscribe( {
			next: (res) => {
				if (res) {
					this.router.navigate(['/home']);
				}
			}
		})
	};

	signup(): void {
		this.modalService.open(AuthenticationComponent, { centered: true });
	}
}