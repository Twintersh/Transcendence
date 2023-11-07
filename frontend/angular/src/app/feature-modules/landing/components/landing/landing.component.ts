import { Component } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
	display = false;

	loginModal() {
		this.display = true;
		console.log('loginModal');
	}
}