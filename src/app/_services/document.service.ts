import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { environment } from '@environments/environment';
import {Observable} from 'rxjs';
import {Document} from '@app/_models/document';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<Document[]> {

    const params = new HttpParams().set('cms', 'true');
    return this.httpClient.get<Document[]>(`${environment.apiUrl}/documents`, {params});
  }

  getAllArray() {
    const params = new HttpParams().set('cms', 'true');
    return this.httpClient.get(`${environment.apiUrl}/documents`, {params});
  }

  getSingle(id) {
    return this.httpClient.get<Document[]>(`${environment.apiUrl}/documents/` + id);
  }

  create(form, categoryId) {
    const body = {
      file: form.value.file.id,
      name: form.value.name,
      order: form.value.order,
      goLiveDate: form.value.goLiveDate,
      enabled: form.value.enabled,
      category: categoryId
    }
    return this.httpClient.post(`${environment.apiUrl}/documents`, body);
  }

  update(form, entityId, categoryId) {
    const body = {
      file: form.value.file.id,
      name: form.value.name,
      order: form.value.order,
      goLiveDate: form.value.goLiveDate,
      enabled: form.value.enabled,
      category: categoryId
    }
    return this.httpClient.put(`${environment.apiUrl}/documents/` + entityId, body);
  }

  updateOrder(body) {
    return this.httpClient.post(`${environment.apiUrl}/documents/setOrder`, body);
  }

  delete(id) {
    return this.httpClient.delete(`${environment.apiUrl}/documents/` + id);
  }
}
