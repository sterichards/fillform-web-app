import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm} from '@angular/forms';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AffirmationService} from '@app/_services/affirmation.service';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {Affirmation} from '@app/_models/affirmation';

@Component({
  selector: 'app-affirmation',
  templateUrl: './affirmation.component.html',
  styleUrls: ['./affirmation.component.css']
})
export class AffirmationComponent implements OnInit {

  uploadForm: FormGroup;
  routeType;
  dataSource;
  affirmationItem;
  @ViewChild(MatSort, null) sort: MatSort;
  @ViewChild('table', null) table: MatTable<Affirmation>;
  private signId;
  tableOrder;
  showConfirmDelete = [];

  displayedColumns = ['name', 'file.name', 'length', 'enabled', 'goLiveDate', 'createdAt', 'download', 'edit'];

  constructor(
    private affirmation: AffirmationService,
    private router: Router,
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.route.data.subscribe(data => this.routeType = data.type);

    if (this.routeType === 'new') {
      this.affirmationItem = {};
    }

    if (this.routeType === 'list') {
      this.affirmation.getAll().subscribe((affirmations) => {
        this.dataSource = new MatTableDataSource(affirmations);
        this.dataSource.sort = this.sort;
      });
    }

    if (this.routeType === 'editorder') {
      this.displayedColumns = ['id', 'name'];
      this.dataSource = this.affirmation.getAllArray().subscribe(
        response => this.dataSource = response);
    }

    if (this.routeType === 'edit') {
      this.affirmation.getSingle(this.route.snapshot.paramMap.get('id')).subscribe((affirmation) => {
        this.affirmationItem = affirmation;
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
      this.createAffirmation(form);
    }

    if (this.routeType === 'edit') {
      this.updateAffirmation(form);
    }
  }

  updateAffirmation(form) {
    this.affirmation.update(form, this.affirmationItem.id).subscribe(response => {
      this.snackBar.open(this.affirmationItem.name + ' has been saved', '', {
        duration: 2000,
      });
      this.router.navigate(['/affirmation']);
    });
  }

  createAffirmation(form) {
    this.affirmation.create(form).subscribe(response => {
      this.snackBar.open(this.affirmationItem.name + ' has been created', '', {
        duration: 2000,
      });
      this.router.navigate(['/affirmation']);
    });
  }

  removeFileFromAffirmation() {
    this.snackBar.open('Affirmation ' + this.affirmationItem.file.fileName + ' removed', '', {
      duration: 2000,
    });
    this.affirmationItem.file = null;
  }

  deleteAffirmation(element) {
    this.affirmationItem.delete(element.id).subscribe(response => {

      // Remove row from table
      const index = this.dataSource.data.indexOf(element);
      this.dataSource.data.splice(index, 1);
      this.dataSource._updateChangeSubscription();

      // Notification popup
      this.snackBar.open('Affirmation ' + element.name + ' removed', '', {
        duration: 2000,
      });
    });
  }

  dropTable(event: CdkDragDrop<Affirmation[]>) {
    this.tableOrder = event;
    const prevIndex = this.dataSource.findIndex((d) => d === event.item.data);
    moveItemInArray(this.dataSource, prevIndex, event.currentIndex);
    this.table.renderRows();
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  hasRole(role) {
    const userRole = JSON.parse(localStorage.getItem('roles'));
    let hasRole = false;

    if (userRole === role) {
      hasRole = true;
    }

    return hasRole;
  }
}
