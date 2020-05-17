import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';

import { environment } from '@environments/environment';
import {Form} from '@app/_models/form';

@Injectable({ providedIn: 'root' })
export class FormSubmissonService {
  constructor(private httpClient: HttpClient) { }

  create(formId, formData) {
    const formJson = JSON.stringify(formData);

    const body = {
      formId: formId,
      data: formJson
    };
    return this.httpClient.post(`${environment.apiUrl}/formsubmission/`, body);
  }
}
