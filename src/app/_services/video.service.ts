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
    return this.httpClient.get<Video[]>(`${environment.apiUrl}/videos`, { params });
  }

  create(fileId, fileName, orderValue) {

    const body = {
      file: fileId,
      name: fileName,
      order: orderValue
    }
    return this.httpClient.post(`${environment.apiUrl}/videos`, body);
  }
}
