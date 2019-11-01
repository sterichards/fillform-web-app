import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { environment } from '@environments/environment';
import {Observable} from 'rxjs';
import {Document} from '@app/_models/document';

@Injectable({
  providedIn: 'root'
})
export class DocumentCategoryService {

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<Document[]> {

    const params = new HttpParams().set('cms', 'true');
    return this.httpClient.get<Document[]>(`${environment.apiUrl}/documentcategories`, {params});
  }

  getSingle(id) {
    return this.httpClient.get<Document[]>(`${environment.apiUrl}/documentcategories/` + id);
  }

  create(form) {
    const body = {
      name: form.value.name,
      order: form.value.order,
    }
    return this.httpClient.post(`${environment.apiUrl}/documentcategories`, body);
  }

  update(form, entityId) {
    const body = {
      name: form.value.name,
      order: form.value.order
    }
    return this.httpClient.put(`${environment.apiUrl}/documentcategories/` + entityId, body);
  }

  delete(id) {
    return this.httpClient.delete(`${environment.apiUrl}/documentcategories/` + id);
  }
}
