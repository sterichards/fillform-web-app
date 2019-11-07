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
import {MatDialog} from '@angular/material/dialog';

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
  tableOrder;
  showConfirmDelete = [];

  displayedColumns = ['name', 'file.name', 'length', 'enabled', 'goLiveDate', 'createdAt', 'download', 'edit'];

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
      this.audioItem = {};
    }

    if (this.routeType === 'list') {
      this.audio.getAll().subscribe((audios) => {
        this.dataSource = new MatTableDataSource(audios);
        this.dataSource.sort = this.sort;
      });
    }

    if (this.routeType === 'editorder') {
      this.displayedColumns = ['id', 'name'];
      this.dataSource = this.audio.getAllArray().subscribe(
        response => this.dataSource = response);
    }

    if (this.routeType === 'edit') {
      this.audio.getSingle(this.route.snapshot.paramMap.get('id')).subscribe((audio) => {
        this.audioItem = audio;
      });
    }

    // Add delete column to table
    if (this.hasRole('ROLE_ADMIN') || this.hasRole('ROLE_MANAGER')) {
      this.displayedColumns.push('delete');
    }

    this.uploadForm = this.formBuilder.group({
      profile: ['']
    });
  }

  onSubmit(form: NgForm) {
    if (this.routeType === 'new') {
      this.createAudio(form);
    }

    if (this.routeType === 'edit') {
      this.updateAudio(form);
    }
  }

  updateAudio(form) {
    this.audio.update(form, this.audioItem.id).subscribe(response => {
      this.snackBar.open(this.audioItem.name + ' has been saved', '', {
        duration: 2000,
      });
      this.router.navigate(['/audio']);
    });
  }

  createAudio(form) {
    this.audio.create(form).subscribe(response => {
      this.snackBar.open(this.audioItem.name + ' has been created', '', {
        duration: 2000,
      });
      this.router.navigate(['/audio']);
    });
  }

  removeFileFromAudio() {
    this.snackBar.open('Audio ' + this.audioItem.file.fileName + ' removed', '', {
      duration: 2000,
    });
    this.audioItem.file = null;
  }

  deleteAudio(element) {
    this.audio.delete(element.id).subscribe(response => {

      // Remove row from table
      const index = this.dataSource.data.indexOf(element);
      this.dataSource.data.splice(index, 1);
      this.dataSource._updateChangeSubscription();

      // Notification popup
      this.snackBar.open('Audio ' + element.name + ' removed', '', {
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

      this.snackBar.open('Uploading audio...', '', {
        duration: 2000,
      });

      this.httpClient.post(signResponse.s3UploadUrl, formData).subscribe(s3UploadResponse => {});

      this.audioItem.file = signResponse;
    });
  }

  saveAudioOrder() {
    let i = 1;
    let newOrder = [];
    this.tableOrder.container.data.forEach(audioRow => {
      const objKey = Object.keys(audioRow);
      newOrder.push({
        id: audioRow.id,
        order: i
      });
      i++;
    });

    this.audio.updateOrder(newOrder).subscribe(response => {
      this.router.navigate(['/audio']);
    });
  }

  dropTable(event: CdkDragDrop<Audio[]>) {
    this.tableOrder = event;
    const prevIndex = this.dataSource.findIndex((d) => d === event.item.data);
    moveItemInArray(this.dataSource, prevIndex, event.currentIndex);
    this.table.renderRows();
  }

  hasRole(role) {
    const userRoles = JSON.parse(localStorage.getItem('roles'));
    let hasRole = false;

    userRoles.forEach(userRole => {
      if (userRole === role) {
        hasRole = true;
      }
    });

    return hasRole;
  }
}
