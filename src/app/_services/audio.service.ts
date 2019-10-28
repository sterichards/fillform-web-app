import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { environment } from '@environments/environment';
import {Observable} from 'rxjs';
import {Audio} from '@app/_models/audio';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<Audio[]> {

    const params = new HttpParams().set('cms', 'true');
    return this.httpClient.get<Audio[]>(`${environment.apiUrl}/audio`, { params });
  }

  create(fileId, fileName, orderValue) {

    const body = {
      file: fileId,
      name: fileName,
      order: orderValue
    }
    return this.httpClient.post(`${environment.apiUrl}/audio`, body);
  }
}
