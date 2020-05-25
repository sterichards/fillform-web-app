import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';

import { environment } from '@environments/environment';
import {Form} from '@app/_models/form';

@Injectable({ providedIn: 'root' })
export class FormService {
  constructor(private httpClient: HttpClient) { }

  getAll() {
    return this.httpClient.get<Form[]>(`${environment.apiUrl}/forms`);
  }

  getAllArray() {
    const params = new HttpParams().set('cms', 'true');
    return this.httpClient.get(`${environment.apiUrl}/forms`, {params});
  }

  getSingle(id) {
    const params = new HttpParams().set('cms', 'true');
    return this.httpClient.get<any>(`${environment.apiUrl}/forms/` + id, {params});
  }

  create(formName, formComponents) {
    const formJson = JSON.stringify(formComponents);

    const body = {
      name: formName,
      data: formJson
    };
    return this.httpClient.post(`${environment.apiUrl}/forms`, body);
  }

  update(id, formName, formComponents) {
    const body = {
      name: formName,
      data: JSON.stringify(formComponents)
    };
    return this.httpClient.put(`${environment.apiUrl}/forms/` + id, body);
  }

  delete(id) {
    return this.httpClient.delete(`${environment.apiUrl}/forms/` + id);
  }
}
