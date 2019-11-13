import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '@environments/environment';
import {Observable} from 'rxjs';
import {Affirmation} from '@app/_models/affirmation';

@Injectable({
  providedIn: 'root'
})
export class AffirmationService {
  constructor(private httpClient: HttpClient) {
  }

  getAll(): Observable<Affirmation[]> {
    const params = new HttpParams().set('cms', 'true');
    return this.httpClient.get<Affirmation[]>(`${environment.apiUrl}/affirmations`, {params});
  }

  getAllArray() {
    const params = new HttpParams().set('cms', 'true');
    return this.httpClient.get(`${environment.apiUrl}/affirmations`, {params});
  }

  getSingle(id) {
    return this.httpClient.get<Affirmation[]>(`${environment.apiUrl}/affirmations/` + id);
  }

  update(form, entityId) {
    const body = {
      file: form.value.file.id,
      name: form.value.name,
      order: form.value.order,
      goLiveDate: form.value.goLiveDate,
      enabled: form.value.enabled
    }
    return this.httpClient.put(`${environment.apiUrl}/affirmations/` + entityId, body);
  }
}
