import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FormGroup, FormBuilder, NgForm} from '@angular/forms';
import {AudioService} from '../_services/audio.service';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {environment} from '@environments/environment';
import {sign} from '@app/_models/sign';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {Audio} from '@app/_models/audio';
import {CdkDragDrop, moveItemInArray, transferArrayItem, CdkDragHandle} from '@angular/cdk/drag-drop';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-audio',
  templateUrl: './audio.component.html',
  styleUrls: ['./audio.component.css']
})
export class AudioComponent implements OnInit {
  uploadForm: FormGroup;
  routeType;
  dataSource;
  audioItem;
  @ViewChild(MatSort, null) sort: MatSort;
  @ViewChild('table', null) table: MatTable<Audio>;
  private signId;

  displayedColumns = ['id', 'name', 'file.name', 'length', 'enabled', 'goLiveDate', 'createdAt', 'listen', 'edit'];

  constructor(
    private audio: AudioService,
    private router: Router,
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit() {

    this.route.data.subscribe(data => this.routeType = data.type);

    if (this.routeType === 'new') {
    }

    if (this.routeType === 'list') {
      this.audio.getAll().subscribe((audios) => {
        this.dataSource = new MatTableDataSource(audios);
        this.dataSource.sort = this.sort;
      });
    }

    if (this.routeType === 'edit') {
      this.audio.getSingle(1).subscribe((audio) => {
        this.audioItem = audio;
      });
    }

    this.uploadForm = this.formBuilder.group({
      profile: ['']
    });
  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.uploadForm.get('profile').setValue(file);
    }
  }

  onSubmit(form: NgForm)
  {
    if (this.routeType === 'new') {
      this.createAudio(form);
    }

    if (this.routeType === 'edit') {
      this.updateAudio(form);
    }

  }

  updateAudio(form)
  {
    this.audio.update(form, this.audioItem.id).subscribe(response => {
      this.router.navigate(['/audio']);
    });
  }

  createAudio(form)
  {
    console.log(form);

    const body = {
      fileName: form.value.profile.name,
      fileSize: form.value.profile.size,
      mimeType: form.value.profile.type,
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

      this.httpClient.post(signResponse.s3UploadUrl, formData).subscribe(s3UploadResponse => {
        this.audio.create(signResponse, form.value.profile.name, 1, true, true).subscribe(audioCreateResponse => {
          this.router.navigate(['/audio']);
        });
      });
    });
  }

  removeAudio()
  {
    this.snackBar.open('Audio ' + this.audioItem.file.fileName + ' removed', '', {
      duration: 2000,
    });
    this.audioItem.file = null;
  }

  uploadFile(file)
  {
    console.log('file');
    console.log(file);
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
        this.audio.create(sign, form.value.profile.name, 1, true, true).subscribe(audioCreateResponse => {
          this.router.navigate(['/audio']);
        });
      });
    });
  }

  dropTable(event: CdkDragDrop<Audio[]>) {
    const prevIndex = this.dataSource.findIndex((d) => d === event.item.data);
    moveItemInArray(this.dataSource, prevIndex, event.currentIndex);
    this.table.renderRows();
  }
}
