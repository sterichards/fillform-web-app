import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormGroup, FormBuilder, Validators, NgForm} from '@angular/forms';
import {VideoService} from '../_services/video.service';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '@environments/environment';
import {sign} from '@app/_models/sign';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {Video} from '@app/_models/video';
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit {
  uploadForm: FormGroup;
  routeType;
  dataSource;
  videoItem;
  @ViewChild(MatSort, null) sort: MatSort;
  @ViewChild('table', null) table: MatTable<Video>;
  @ViewChild(MatPaginator, null) paginator: MatPaginator;
  private signId;
  showConfirmDelete = [];

  displayedColumns = ['name', 'file.name', 'length', 'enabled', 'goLiveDate', 'createdAt', 'watch', 'edit', 'delete'];

  formGroup = this.formBuilder.group({
    file: [null, Validators.required]
  });

  constructor(
    private video: VideoService,
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
      this.videoItem = {};
    }

    if (this.routeType === 'list') {
      this.video.getAll().subscribe((videos) => {
        this.dataSource = new MatTableDataSource(videos);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    }

    if (this.routeType === 'edit') {
      this.video.getSingle(this.route.snapshot.paramMap.get('id')).subscribe((video) => {
        this.videoItem = video;
      });
    }

    this.uploadForm = this.formBuilder.group({
      profile: ['']
    });
  }

  onSubmit(form: NgForm) {
    if (this.routeType === 'new') {
      this.createVideo(form);
    }

    if (this.routeType === 'edit') {
      this.updateVideo(form);
    }
  }

  updateVideo(form) {
    this.video.update(form, this.videoItem.id).subscribe(response => {
      this.snackBar.open(this.videoItem.name + ' has been saved', '', {
        duration: 2000,
      });
      this.router.navigate(['/video']);
    });
  }

  createVideo(form) {
    this.video.create(form).subscribe(response => {
      this.snackBar.open(this.videoItem.name + ' has been created', '', {
        duration: 2000,
      });
      this.router.navigate(['/video']);
    });
  }

  removeFileFromVideo() {
    this.snackBar.open('Video ' + this.videoItem.file.fileName + ' removed', '', {
      duration: 2000,
    });
    this.videoItem.file = null;
  }

  deleteVideo(element) {
    this.video.delete(element.id).subscribe(response => {

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
      formData.append('file', fileData);

      this.snackBar.open('Uploading video...', '', {
        duration: 2000,
      });

      this.httpClient.post(signResponse.s3UploadUrl, formData).subscribe(s3UploadResponse => {});

      this.videoItem.file = signResponse;
    });
  }
}
