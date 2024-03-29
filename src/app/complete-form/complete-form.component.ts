import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {FormService} from '@app/_services/form.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {FormSubmissonService} from '@app/_services/form-submisson.service';

@Component({
  selector: 'app-complete-form',
  templateUrl: './complete-form.component.html'
})
export class CompleteFormComponent implements OnInit {

  form;
  formName;

  constructor(
    public formService: FormService,
    public formSubmissionService: FormSubmissonService,
    public router: Router,
    public snackBar: MatSnackBar,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.formService.getSingle(this.route.snapshot.paramMap.get('id')).subscribe((form) => {
      this.form = form;
      this.formName = form.name;
    });
  }

  onSubmit(submission: any) {
    console.log(submission);

    this.formSubmissionService.create(this.route.snapshot.paramMap.get('id'), submission).subscribe((formSubmissionResponse) => {
      console.log(formSubmissionResponse);
    });
  }
}
