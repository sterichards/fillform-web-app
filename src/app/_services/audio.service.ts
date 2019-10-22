import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  constructor(private httpClient: HttpClient) { }

  getAll() {
    return this.httpClient.get(`${environment.apiUrl}/audio`);
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
