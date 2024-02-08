import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth.service'
import { Router } from '@angular/router';

@Component({
  selector: 'landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})

export class LandingComponent implements OnInit {

	constructor(private authService: AuthService, private router: Router) {
	}

	ngOnInit() {
		this.isAuth();
	}

	isAuth(): void {
		this.authService.isAuth().subscribe( {
			next: (res) => {
				if (res) {
					window.location.href = 'http://localhost:4200/home';
				}
			}
		})
	};

	sign42() {
		this.authService.signup42();
	}
}