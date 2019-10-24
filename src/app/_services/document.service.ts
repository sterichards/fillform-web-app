import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  constructor(private httpClient: HttpClient) { }

  getAll() {
    const params = new HttpParams().set('cms', 'true');
    return this.httpClient.get(`${environment.apiUrl}/documents`, { params });
  }

  createDocument(fileId, fileName, orderValue) {

    const body = {
      file: fileId,
      name: fileName,
      order: orderValue
    }
    return this.httpClient.post(`${environment.apiUrl}/documents`, body);
  }
}
