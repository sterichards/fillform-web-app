import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { environment } from '@environments/environment';
import {Observable} from "rxjs";
import {Document} from "@app/_models/document";
import {User} from "@app/_models";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  users: Array<object>;

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<User[]> {

    const params = new HttpParams().set('cms', 'true');
    return this.httpClient.get<User[]>(`${environment.apiUrl}/users`, { params });
  }

  createUser(Email, Forename, Surname, Company, Password) {

    const UserObject = {
      email: Email,
      forename: Forename,
      surname: Surname,
      company: Company,
      plainPassword: Password
    };

    this.httpClient.post(`${environment.apiUrl}/users`, UserObject);
  }
}
