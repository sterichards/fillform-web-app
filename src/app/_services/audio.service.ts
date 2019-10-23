import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  constructor(private httpClient: HttpClient) { }

  getAll() {
    const params = new HttpParams().set('cms', 'true');
    return this.httpClient.get(`${environment.apiUrl}/audio`, { params });
  }

  createAudio(fileId, fileName, orderValue) {

    const body = {
      file: fileId,
      name: fileName,
      order: orderValue
    }
    return this.httpClient.post(`${environment.apiUrl}/audio`, body);
  }
}
