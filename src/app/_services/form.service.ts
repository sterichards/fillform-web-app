import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';

import { environment } from '@environments/environment';
import {Form} from '@app/_models/form';

@Injectable({ providedIn: 'root' })
export class FormService {
  constructor(private httpClient: HttpClient) { }

  getAll() {
    return this.httpClient.get<Form[]>(`${environment.apiUrl}/form`);
  }

  getAllArray() {
    const params = new HttpParams().set('cms', 'true');
    return this.httpClient.get(`${environment.apiUrl}/form`, {params});
  }

  getById(id: number) {
    return this.httpClient.get<Form>(`${environment.apiUrl}/form/${id}`);
  }

  create(formName, formComponents) {
    const formJson = JSON.stringify(formComponents);

    const body = {
      name: formName,
      data: formJson
    };
    return this.httpClient.post(`${environment.apiUrl}/form/`, body);
  }

  update(id, form) {
    const body = {
      name: form.value.name,
      data: form.value.data
    };
    return this.httpClient.put(`${environment.apiUrl}/form/` + id, body);
  }
}
