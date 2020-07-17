import { Component, OnInit } from '@angular/core';
import {FormSubmissonService} from '@app/_services/form-responses.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar, MatTableDataSource} from '@angular/material';
import {AppService} from '@app/app.service';

@Component({
  selector: 'app-view-form-responses-list',
  templateUrl: './view-form-responses-list.component.html',
  styleUrls: ['./view-form-responses-list.component.css']
})
export class ViewFormResponsesListComponent implements OnInit {

  form;
  formResponses;
  constructor(
    public formSubmisionService: FormSubmissonService,
    public router: Router,
    public snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private appService: AppService
  ) { }

  ngOnInit() {
    this.formSubmisionService.getSingle(this.route.snapshot.paramMap.get('id')).subscribe((formResponses) => {
      this.formResponses = formResponses;
      console.log(formResponses);
    });
  }

}
