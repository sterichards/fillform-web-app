import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  users: Array<object>;

  constructor(private httpClient: HttpClient) { }

  getUsers() {
    return this.httpClient.get(`${environment.apiUrl}/users`);
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
