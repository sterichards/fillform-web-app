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
    return this.httpClient.get<any[]>(`${environment.apiUrl}/affirmations`, {params});
  }

  getSingle(id) {
    const params = new HttpParams().set('cms', 'true');
    return this.httpClient.get<any[]>(`${environment.apiUrl}/affirmations/` + id, {params});
  }

  update(entityId, form, affirmationItem) {

    const body = {
      keyword: form.value.keyword,
      hint: affirmationItem.hint,
      explanation: form.value.explanation,
      largeImage: form.value.file.id,
      textXPos: affirmationItem.textXPos,
      textYPos: affirmationItem.textYPos,
      textAlignment: affirmationItem.textAlignment,
      textColor: affirmationItem.textColor
    }
    return this.httpClient.put(`${environment.apiUrl}/affirmations/` + entityId, body);
  }
}
