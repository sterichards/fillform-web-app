import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {FormService} from '@app/_services/form.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-preview-form',
  templateUrl: './preview-form.component.html'
})
export class PreviewFormComponent implements OnInit {

  form;
  formData;

  constructor(
    public formService: FormService,
    public router: Router,
    public snackBar: MatSnackBar,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.formService.getSingle(this.route.snapshot.paramMap.get('id')).subscribe((form) => {
      this.form = form;
      this.formData.name = this.form.name;
    });
  }

  onSubmit(submission: any) {
    console.log(submission);
  }
}
