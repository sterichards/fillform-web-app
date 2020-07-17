import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar, MatSort, MatTable, MatTableDataSource} from '@angular/material';
import {FormSubmissonService} from '@app/_services/form-responses.service';
import {Form} from '@app/_models/form';
import {AppService} from '@app/app.service';

@Component({
  selector: 'app-view-form-responses',
  templateUrl: './view-form-responses.component.html'
})
export class ViewFormResponsesComponent implements OnInit {

  @ViewChild(MatSort, null) sort: MatSort;
  @ViewChild('table', null) table: MatTable<Form>;
  displayedColumns = ['id', 'createdAt', 'viewResponses'];
  form;
  formResponses;
  dataSource;
  formId;

  constructor(
    public formSubmisionService: FormSubmissonService,
    public router: Router,
    public snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private appService: AppService
  ) {}

  ngOnInit() {
    this.formId = this.route.snapshot.paramMap.get('id');
    this.formSubmisionService.getSingle(this.route.snapshot.paramMap.get('id')).subscribe((formResponses) => {
      this.formResponses = formResponses;
      this.dataSource = new MatTableDataSource(formResponses);
      this.dataSource.sort = this.sort;
    });
  }

  downloadResponsesAsCsv(formId) {
    console.log(this.formResponses);

    this.appService.downloadFile(this.formResponses, 'form-responses');
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

}
