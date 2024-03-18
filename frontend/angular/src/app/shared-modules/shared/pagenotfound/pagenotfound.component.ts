import { Component } from '@angular/core';

import { Router } from '@angular/router';

@Component({
  selector: 'pagenotfound',
  templateUrl: './pagenotfound.component.html',
  styleUrls: ['./pagenotfound.component.scss']
})
export class PageNotFoundComponent {

	constructor(
		private router: Router
	) { }

	goHome(): void{
		this.router.navigateByUrl('/');
	}
}
