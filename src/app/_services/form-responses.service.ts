import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class FormSubmissonService {
  constructor(private httpClient: HttpClient) { }

  getSingle(id) {
    const params = new HttpParams().set('cms', 'true');
    return this.httpClient.get<any>(`${environment.apiUrl}/formresponses/` + id, {params});
  }
}
