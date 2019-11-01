import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormGroup, FormBuilder, Validators, NgForm} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {Document} from '@app/_models/document';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {DocumentCategoryService} from '@app/_services/document-category.service';

@Component({
  selector: 'app-document',
  templateUrl: './document-category.component.html',
  styleUrls: ['./document-category.component.css']
})
export class DocumentCategoryComponent implements OnInit {

  angForm: FormGroup;
  uploadForm: FormGroup;
  routeType;
  dataSource;
  documentCategoryItem;
  @ViewChild(MatSort, null) sort: MatSort;
  @ViewChild('table', null) table: MatTable<Document>;
  private signId;
  showConfirmDelete = [];

  displayedColumns = ['name', 'createdAt', 'edit', 'delete'];

  constructor(
    private documentCategory: DocumentCategoryService,
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
      this.documentCategoryItem = {};
    }

    if (this.routeType === 'list') {
      this.documentCategory.getAll().subscribe((documentCategories) => {
        this.dataSource = new MatTableDataSource(documentCategories);
        this.dataSource.sort = this.sort;
      });
    }

    if (this.routeType === 'edit') {
      this.documentCategory.getSingle(this.route.snapshot.paramMap.get('id')).subscribe((document) => {
        this.documentCategoryItem = document;
      });
    }

    this.uploadForm = this.formBuilder.group({
      profile: ['']
    });
  }

  onSubmit(form: NgForm) {
    if (this.routeType === 'new') {
      this.createDocumentCategory(form);
    }

    if (this.routeType === 'edit') {
      this.updateDocumentCategory(form);
    }
  }

  updateDocumentCategory(form) {
    this.documentCategory.update(form, this.documentCategoryItem.id).subscribe(response => {
      this.snackBar.open(this.documentCategoryItem.name + ' has been saved', '', {
        duration: 2000,
      });
      this.router.navigate(['/document-category']);
    });
  }

  createDocumentCategory(form) {
    this.documentCategory.create(form).subscribe(response => {
      this.snackBar.open(this.documentCategoryItem.name + ' has been created', '', {
        duration: 2000,
      });
      this.router.navigate(['/document-category']);
    });
  }

  deleteDocumentCategory(element) {
    this.documentCategory.delete(element.id).subscribe(response => {

      // Remove row from table
      const index = this.dataSource.data.indexOf(element);
      this.dataSource.data.splice(index, 1);
      this.dataSource._updateChangeSubscription();

      // Notification popup
      this.snackBar.open('Document Category ' + element.name + ' removed', '', {
        duration: 2000,
      });
    });
  }
}
