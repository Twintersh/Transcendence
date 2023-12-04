import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

	constructor(private readonly http: HttpClient) { }

  	public signup(newUser: User) {
		return this.http.post('http://127.0.0.1:8000/users/signup/', newUser)
	}	

	public signup42(newUser: User) {
		return this.http.post('http://127.0.0.1:8000/users/sign42/', newUser)
	}	
}
