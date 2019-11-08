import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { environment } from '@environments/environment';
import {Observable} from 'rxjs';
import {User} from '@app/_models';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  users: Array<object>;

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<User[]> {
    const params = new HttpParams().set('cms', 'true');
    return this.httpClient.get<User[]>(`${environment.apiUrl}/users`, {params});
  }

  getAllArray() {
    const params = new HttpParams().set('cms', 'true');
    return this.httpClient.get(`${environment.apiUrl}/users`, {params});
  }

  getSingle(id) {
    return this.httpClient.get<any[]>(`${environment.apiUrl}/users/` + id);
  }

  create(form) {

    console.log(form);

    const body = {
      forename: form.value.forename,
      surname: form.value.surname,
      email: form.value.email,
      company: form.value.company,
      enabled: form.value.enabled,
      roles: [form.value.role],
      plainPassword: form.value.password
    }
    return this.httpClient.post(`${environment.apiUrl}/users`, body);
  }

  update(form, username) {
    const body = {
      forename: form.value.forename,
      surname: form.value.surname,
      email: form.value.email,
      company: form.value.company,
      enabled: form.value.enabled,
      roles: [form.value.role]
    }
    return this.httpClient.post(`${environment.apiUrl}/users/` + username + `/updateUser`, body);
  }

  delete(id) {
    return this.httpClient.delete(`${environment.apiUrl}/users/` + id);
  }

  getRoles() {
    return this.httpClient.get<any[]>(`${environment.apiUrl}/roles`);
  }
}
