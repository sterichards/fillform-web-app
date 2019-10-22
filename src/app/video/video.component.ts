import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {VideoService} from '../_services/video.service';
import {DocumentService} from '../_services/document.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit {

  angForm: FormGroup;
  videos;

  constructor(private fb: FormBuilder, private video: VideoService, private router: Router) {
    this.createForm();
  }

  createForm() {
    this.angForm = this.fb.group({
      ProductName: ['', Validators.required],
      ProductDescription: ['', Validators.required],
      ProductPrice: ['', Validators.required]
    });
  }
  ngOnInit() {
    this.getVideos();
  }

  getVideos() {
    this.video.getVideos().subscribe(res => this.videos = res);
  }
}
