import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm} from '@angular/forms';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AffirmationService} from '@app/_services/affirmation.service';
import {Affirmation} from '@app/_models/affirmation';
import { ColorEvent } from 'ngx-color';

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
  @ViewChild('editor', null) editor;
  private signId;
  showConfirmDelete = [];
  state;
  positions = [
    {
      id: 'l',
      name: 'Left'
    },
    {
      id: 'c',
      name: 'Center'
    },
    {
      id: 'r',
      name: 'Right'
    },
  ];
  autoTicks = false;
  disabled = false;
  invert = true;
  max = 100;
  min = 0;
  showTicks = false;
  step = 1;
  thumbLabel = true;
  value = 0;
  vertical = true;
  tickInterval = 1;
  textYPos;
  theHtmlString = 'Hello <b>this</b> is bold';

  displayedColumns = ['day', 'createdAt', 'preview', 'edit'];


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

    if (this.routeType === 'list') {
      this.affirmation.getAll().subscribe((affirmations) => {
        this.dataSource = new MatTableDataSource(affirmations);
        this.dataSource.sort = this.sort;
      });
    }

    if (this.routeType === 'edit') {
      this.affirmation.getSingle(this.route.snapshot.paramMap.get('id')).subscribe((affirmation) => {
        this.affirmationItem = affirmation;
      });
    }

    this.uploadForm = this.formBuilder.group({
      profile: ['']
    });
  }

  onSubmit(form: NgForm) {

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

  removeFileFromAffirmation() {
    this.snackBar.open('Affirmation ' + this.affirmationItem.file.fileName + ' removed', '', {
      duration: 2000,
    });
    this.affirmationItem.file = null;
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  colorChanged($event: ColorEvent) {
    this.affirmationItem.textColor = $event.color.hex;
  }

  setTextAlignment(textPositionValue) {
    this.affirmationItem.textAlignment = textPositionValue;
  }

  boldenText() {
    var text = "";
    if (window.getSelection) {
      text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
      text = document.selection.createRange().text;
    }
    this.selectedText = text;

    this.theHtmlString = this.theHtmlString.replace(/<\/?[^>]+(>|$)/g, "");

    const replaced = this.theHtmlString.replace(text, '<b>' + text + '</b>');
    this.theHtmlString = replaced;
    console.log(replaced);

    console.log('highlighted');
    console.log(text);
    console.log()
    console.log(this.theHtmlString);
  }
}
