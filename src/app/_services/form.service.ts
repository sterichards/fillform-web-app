import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';

import { environment } from '@environments/environment';
import {Form} from '@app/_models/form';

@Injectable({ providedIn: 'root' })
export class FormService {
  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Form[]>(`${environment.apiUrl}/form`);
  }

  getAllArray() {
    const params = new HttpParams().set('cms', 'true');
    return this.http.get(`${environment.apiUrl}/form`, {params});
  }

  getById(id: number) {
    return this.http.get<Form>(`${environment.apiUrl}/form/${id}`);
  }
}
