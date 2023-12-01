import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  currentUrl: string;

  constructor(private router: Router) {
    this.currentUrl = '';
  }

  ngOnInit() {
    // Subscribe to route changes
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Update the current URL when the navigation ends
        this.currentUrl = this.router.url;
        console.log(this.currentUrl);
      }
    });
  }
  
}