import { Injectable } from '@angular/core';
import { CookieService as NgxCookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CookieService {

  constructor(private cookieService: NgxCookieService) { }
  
  public saveCookie(key: string, value: string) {
    this.cookieService.set(key, value);
  }

  public getCookie(key: string) {
    return this.cookieService.get(key);
  }

  public removeCookie(key: string) {
	this.cookieService.delete(key);
  }

  public clearCookie() {
	this.cookieService.deleteAll();
  }
}
