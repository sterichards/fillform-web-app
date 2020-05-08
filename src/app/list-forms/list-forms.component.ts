import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort, MatTable, MatTableDataSource} from '@angular/material';
import {Form} from '@app/_models/form';
import {Router} from '@angular/router';
import {FormService} from '@app/_services/form.service';

@Component({
  selector: 'app-list-forms',
  templateUrl: './list-forms.component.html',
  styleUrls: ['./list-forms.component.css']
})
export class ListFormsComponent implements OnInit {

  dataSource;
  @ViewChild(MatSort, null) sort: MatSort;
  @ViewChild('table', null) table: MatTable<Form>;
  displayedColumns = ['name', 'createdAt', 'edit'];
  forms;

  constructor(
    private formService: FormService,
    public router: Router
  ) { }

  ngOnInit() {
    this.formService.getAll().subscribe((forms) => {
      this.dataSource = new MatTableDataSource(forms);
      this.dataSource.sort = this.sort;
    });

    this.formService.getAllArray().subscribe((forms) => {
      this.forms = forms;
    });
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }
}
