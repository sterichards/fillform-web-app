import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '@environments/environment';
import {Observable} from 'rxjs';
import {Audio} from '@app/_models/audio';
import * as _moment from 'moment';
import {default as _rollupMoment} from 'moment';
const moment = _rollupMoment || _moment;

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

  create(fileId, fileName, orderValue, goLiveDate, enabled) {

    const formattedGoLiveDate = moment(goLiveDate).format('YYYY-MM-DD HH:MM');

    const body = {
      file: fileId,
      name: fileName,
      order: orderValue,
      goLiveDate: formattedGoLiveDate,
      enabled: enabled
    }
    return this.httpClient.post(`${environment.apiUrl}/audio`, body);
  }

  update(fileId, fileName, orderValue, goLiveDate, enabled, entityId) {

    const formattedGoLiveDate = moment(goLiveDate).format('YYYY-MM-DD HH:MM');

    const body = {
      file: fileId,
      name: fileName,
      order: orderValue,
      goLiveDate: goLiveDate,
      enabled: enabled
    }
    return this.httpClient.put(`${environment.apiUrl}/audio/` + entityId, body);
  }
}
