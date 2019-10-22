import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators, NgForm} from '@angular/forms';
import {AudioService} from '../_services/audio.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {FileService} from '@app/_services/file.service';

@Component({
  selector: 'app-audio',
  templateUrl: './audio.component.html',
  styleUrls: ['./audio.component.css']
})
export class AudioComponent implements OnInit {

  angForm: FormGroup;
  audios;
  SERVER_URL = 'https://s3-eu-west-1.amazonaws.com/happy-hints-file-repository-dev/';
  uploadForm: FormGroup;

  formGroup = this.formBuilder.group({
    file: [null, Validators.required]
  });

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];

  constructor(
    private audio: AudioService,
    private router: Router,
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private upload: FileService
  ) {
    this.createForm();
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
    const formData = new FormData();

    this.upload.signFile(form, this.uploadForm).subscribe(response => {
      this.audio.createAudio(response.id, 'test', 1);
    }, err => {
      throw err;
    });
  }


  ngOnInit() {
    this.audio.getAll().subscribe(res => this.audios = res);

    this.uploadForm = this.formBuilder.group({
      profile: ['']
    });
  }

  customers = [
    { name: 'Adam', age: 23 },
    { name: 'Jack', age: 27 },
    { name: 'Katherin', age: 26 },
    { name: 'John', age: 30 },
    { name: 'Watson', age: 42 },
  ];

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.customers, event.previousIndex, event.currentIndex);
  }

}
