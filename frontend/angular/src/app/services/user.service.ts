import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private readonly http: HttpClient) { }

  public getUserInfos(authToker: string) {
	return this.http.get<User>('http://127.0.0.1:8000/users/infos/', authToker);
}
