import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  SERVER_URL = 'https://s3-eu-west-1.amazonaws.com/happy-hints-file-repository-dev/';

  constructor(private httpClient: HttpClient) {
  }

  signFile(form, uploadForm) {

    const body = {
      fileName: form.value.profile.name,
      fileSize: form.value.profile.size,
      mimeType: form.value.profile.type,
    }

    this.httpClient.post('http://localhost/app_dev.php/files/sign', body).subscribe(response => {

      const formData = new FormData();

      response.s3PostPolicy.conditions.forEach(function (signItem) {
        let objKey = Object.keys(signItem);
        formData.append(objKey, signItem[objKey]);
      });

      formData.append('policy', response.s3PostPolicyEncodedString);
      formData.append('X-Amz-Signature', response.s3PostPolicySignature);
      formData.append('file', uploadForm.get('profile').value);

      this.httpClient.post<any>(this.SERVER_URL, formData).subscribe(
        (res) => console.log(res),
        (err) => console.log(err)
      );
    });
  }
}
