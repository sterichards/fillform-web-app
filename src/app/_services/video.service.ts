import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { environment } from '@environments/environment';
import {Observable} from 'rxjs';
import {Video} from '@app/_models/video';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<Video[]> {

    const params = new HttpParams().set('cms', 'true');
    return this.httpClient.get<Video[]>(`${environment.apiUrl}/videos`, {params});
  }

  getAllArray() {
    const params = new HttpParams().set('cms', 'true');
    return this.httpClient.get(`${environment.apiUrl}/videos`, {params});
  }

  getSingle(id) {
    return this.httpClient.get<Video[]>(`${environment.apiUrl}/videos/` + id);
  }

  create(form) {
    const body = {
      file: form.value.file.id,
      name: form.value.name,
      order: form.value.order,
      goLiveDate: form.value.goLiveDate,
      enabled: form.value.enabled
    }
    return this.httpClient.post(`${environment.apiUrl}/videos`, body);
  }

  update(form, entityId) {
    const body = {
      file: form.value.file.id,
      name: form.value.name,
      order: form.value.order,
      goLiveDate: form.value.goLiveDate,
      enabled: form.value.enabled
    }
    return this.httpClient.put(`${environment.apiUrl}/videos/` + entityId, body);
  }

  updateOrder(body) {
    return this.httpClient.post(`${environment.apiUrl}/video/setOrder`, body);
  }

  delete(id) {
    return this.httpClient.delete(`${environment.apiUrl}/videos/` + id);
  }
}
