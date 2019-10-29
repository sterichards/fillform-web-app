import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormGroup, FormBuilder, Validators, NgForm} from '@angular/forms';
import {DocumentService} from '../_services/document.service';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '@environments/environment';
import {sign} from '@app/_models/sign';
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";


@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentComponent implements OnInit {

  angForm: FormGroup;
  uploadForm: FormGroup;
  routeType;
  dataSource;
  @ViewChild(MatSort, null) sort: MatSort;
  private signId;

  displayedColumns = ['name', 'file.name', 'enabled', 'goLiveDate', 'createdAt', 'location', 'edit'];

  formGroup = this.formBuilder.group({
    file: [null, Validators.required]
  });

  constructor(
    private document: DocumentService,
    private router: Router,
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private route: ActivatedRoute
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.document.getAll().subscribe((documents) => {
      this.dataSource = new MatTableDataSource(documents);
      this.dataSource.sort = this.sort;
    });

    this.route.data.subscribe(data => this.routeType = data.type);

    this.uploadForm = this.formBuilder.group({
      profile: ['']
    });
  }

  createForm() {
    this.angForm = this.formBuilder.group({
      ProductName: ['', Validators.required],
      ProductDescription: ['', Validators.required],
      ProductPrice: ['', Validators.required]
    });
  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.uploadForm.get('profile').setValue(file);
    }
  }

  onSubmit(form: NgForm) {
    const body = {
      fileName: form.value.profile.name,
      fileSize: form.value.profile.size,
      mimeType: form.value.profile.type,
    }

    this.httpClient.post(`${environment.apiUrl}/files/sign`, body).subscribe((response: sign) => {

      // Set the sign Id
      this.signId = response.id;

      let formData = new FormData();

      response.s3PostPolicy.conditions.forEach(signItem => {
        const objKey = Object.keys(signItem);
        formData.append(objKey[0], signItem[objKey[0]]);
      });

      formData.append('policy', response.s3PostPolicyEncodedString);
      formData.append('X-Amz-Signature', response.s3PostPolicySignature);
      formData.append('file', this.uploadForm.get('profile').value);

      this.httpClient.post(response.s3UploadUrl, formData).subscribe(s3UploadResponse => {
        this.document.createDocument(this.signId, form.value.profile.name, 1).subscribe(repsonse => {
          this.router.navigate(['/document']);
        });
      });
    });
  }

}
