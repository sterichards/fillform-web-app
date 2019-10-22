import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private httpClient: HttpClient) {
  }

  signFile(form) {
    const headerDict = {
      'Authorization': 'Bearer YTc0MDRiZmQ4ODg1M2UwOTAwZTgyZDEzNWNiZmM2M2MwODFiMDhkMmZjYWE0MTFiMTYzMjJhNzRlNTEyNGYxMQ'
    }

    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };

    const body = {
      fileName: form.value.profile.name,
      fileSize: form.value.profile.size,
      mimeType: form.value.profile.type,
    }

    return this.httpClient.post('http://localhost/app_dev.php/files/sign', body, requestOptions);
  }


}
