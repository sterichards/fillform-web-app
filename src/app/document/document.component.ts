import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormGroup, FormBuilder, Validators, NgForm} from '@angular/forms';
import {DocumentService} from '../_services/document.service';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {environment} from '@environments/environment';
import {sign} from '@app/_models/sign';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {Document} from '@app/_models/document';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';

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
  documentItem;
  @ViewChild(MatSort, null) sort: MatSort;
  @ViewChild('table', null) table: MatTable<Document>;
  private signId;
  showConfirmDelete = [];

  displayedColumns = ['name', 'file.name', 'enabled', 'goLiveDate', 'createdAt', 'download', 'edit', 'delete'];

  constructor(
    private document: DocumentService,
    private router: Router,
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.route.data.subscribe(data => this.routeType = data.type);

    if (this.routeType === 'new') {
      this.documentItem = {};
    }

    if (this.routeType === 'list') {
      this.document.getAll().subscribe((documents) => {
        this.dataSource = new MatTableDataSource(documents);
        this.dataSource.sort = this.sort;
      });
    }

    if (this.routeType === 'edit') {
      this.document.getSingle(this.route.snapshot.paramMap.get('id')).subscribe((document) => {
        this.documentItem = document;
      });
    }

    this.uploadForm = this.formBuilder.group({
      profile: ['']
    });
  }

  onSubmit(form: NgForm) {
    if (this.routeType === 'new') {
      this.createDocument(form);
    }

    if (this.routeType === 'edit') {
      this.updateDocument(form);
    }
  }

  updateDocument(form) {
    this.document.update(form, this.documentItem.id).subscribe(response => {
      this.snackBar.open(this.documentItem.name + ' has been saved', '', {
        duration: 2000,
      });
      this.router.navigate(['/documents']);
    });
  }

  createDocument(form) {
    this.document.create(form).subscribe(response => {
      this.snackBar.open(this.documentItem.name + ' has been created', '', {
        duration: 2000,
      });
      this.router.navigate(['/documents']);
    });
  }

  removeFileFromDocument() {
    this.snackBar.open('Document ' + this.documentItem.file.fileName + ' removed', '', {
      duration: 2000,
    });
    this.documentItem.file = null;
  }

  deleteDocument(element) {
    this.document.delete(element.id).subscribe(response => {

      // Remove row from table
      const index = this.dataSource.data.indexOf(element);
      this.dataSource.data.splice(index, 1);
      this.dataSource._updateChangeSubscription();

      // Notification popup
      this.snackBar.open('Video ' + element.name + ' removed', '', {
        duration: 2000,
      });
    });
  }

  uploadFile(fileInput: any) {
    const fileData = <File> fileInput.target.files[0];

    const body = {
      fileName: fileData.name,
      fileSize: fileData.size,
      mimeType: fileData.type,
    }

    this.httpClient.post(`${environment.apiUrl}/files/sign`, body).subscribe((signResponse: sign) => {

      // Set the sign Id
      this.signId = signResponse.id;

      let formData = new FormData();

      signResponse.s3PostPolicy.conditions.forEach(signItem => {
        const objKey = Object.keys(signItem);
        formData.append(objKey[0], signItem[objKey[0]]);
      });

      formData.append('policy', signResponse.s3PostPolicyEncodedString);
      formData.append('X-Amz-Signature', signResponse.s3PostPolicySignature);
      formData.append('file', this.uploadForm.get('profile').value);

      this.snackBar.open('Uploading document...', '', {
        duration: 2000,
      });

      this.httpClient.post(signResponse.s3UploadUrl, formData).subscribe(s3UploadResponse => {});

      this.documentItem.file = signResponse;
    });
  }

}
