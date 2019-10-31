import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '@environments/environment';
import {Observable} from 'rxjs';
import {Audio} from '@app/_models/audio';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  constructor(private httpClient: HttpClient) {
  }

  getAll(): Observable<Audio[]> {

    const params = new HttpParams().set('cms', 'true');
    return this.httpClient.get<Audio[]>(`${environment.apiUrl}/audio`, {params});
  }

  getSingle(id) {
    return this.httpClient.get<Audio[]>(`${environment.apiUrl}/audio/` + id);
  }

  create(file, fileName, orderValue, goLiveDate, enabled) {

    const body = {
      file: file.id,
      name: fileName,
      order: orderValue,
      goLiveDate: goLiveDate,
      enabled: enabled
    }
    return this.httpClient.post(`${environment.apiUrl}/audio`, body);
  }

  update(form, entityId)
  {
    const body = {
      file: form.value.file.id,
      name: form.value.name,
      order: form.value.order,
      goLiveDate: form.value.goLiveDate,
      enabled: form.value.enabled
    }
    return this.httpClient.put(`${environment.apiUrl}/audio/` + entityId, body);
  }
}
