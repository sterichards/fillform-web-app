import {Component, Inject, OnInit, ViewChild} from '@angular/core';
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
import {environment} from "@environments/environment";
import {sign} from "@app/_models/sign";

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
  invert = false;
  max = 100;
  min = 0;
  showTicks = false;
  step = 1;
  thumbLabel = false;
  vertical = true;
  textYPos;
  theHtmlString;
  showBoldButton = false;
  selectedText;
  test123 = 25;
  value = 40;
  cssClass = {
    position: 'absolute',
    color: 'white',
    'border-top': '0px',
    'text-align': 'right',
    top: '0%',
    'font-size': '40px'
  }

  someVar = 'My text';

  displayedColumns = ['day', 'keyword', 'createdAt', 'preview', 'edit'];


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
        this.updateCss();
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

    this.affirmation.update(this.affirmationItem.id, form, this.affirmationItem).subscribe(response => {
      this.snackBar.open(this.affirmationItem.name + ' has been saved', '', {
        duration: 2000,
      });
      this.router.navigate(['/affirmation']);
    });
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  colorChanged($event: ColorEvent) {
    this.affirmationItem.textColor = $event.color.hex;
    this.cssClass.color = $event.color.hex;
  }

  setTextAlignment(textPositionValue) {
    this.affirmationItem.textAlignment = textPositionValue;
  }

  formatDate(date) {
    const day = date.substr(2);
    const month = date.substr(0, 2);

    return day + '-' + month;
  }

  boldenText() {
    let text = '';
    if (window.getSelection) {
      text = window.getSelection().toString();
    }
    this.selectedText = text;

    this.affirmationItem.hint = this.affirmationItem.hint.replace(/<\/?[^>]+(>|$)/g, '');

    const replaced = this.affirmationItem.hint.replace(text, '<b>' + text + '</b>');
    this.affirmationItem.hint = replaced;

    this.showBoldButton = false;
  }

  checkIfTextIsHighlighted() {
    let text = '';
    if (window.getSelection) {
      text = window.getSelection().toString();
    }
    const selectedText = text;

    if (selectedText.length > 0) {
      this.showBoldButton = true;
    } else {
      this.showBoldButton = false;
    }
  }

  updateSliderValue(event) {
    this.affirmationItem.textYPos = event.value;
    this.cssClass.top = event.value + '%';
  }

  uploadFile(fileInput: any) {
    const fileData = <File> fileInput.target.files[0];

    if (fileInput.target.files.length > 0) {
      const file = fileInput.target.files[0];
      this.uploadForm.get('profile').setValue(file);
    }

    const body = {
      fileName: fileData.name,
      fileSize: fileData.size,
      mimeType: fileData.type,
    }

    this.httpClient.post(`${environment.apiUrl}/files/sign`, body).subscribe((signResponse: sign) => {

      // Set the sign Id
      this.signId = signResponse.id;

      let formData = new FormData();

      signResponse.s3PostPolicy.conditions.forEach(signItem => {
        const objKey = Object.keys(signItem);
        formData.append(objKey[0], signItem[objKey[0]]);
      });

      formData.append('policy', signResponse.s3PostPolicyEncodedString);
      formData.append('X-Amz-Signature', signResponse.s3PostPolicySignature);
      formData.append('file', this.uploadForm.get('profile').value);

      this.snackBar.open('Uploading image...', '', {
        duration: 2000,
      });

      this.httpClient.post(signResponse.s3UploadUrl, formData).subscribe(s3UploadResponse => {});

      this.affirmationItem.largeImage = signResponse;
    });
  }

  removeImageFromAffirmation() {
    this.snackBar.open('Audio ' + this.affirmationItem.largeImage.fileName + ' removed', '', {
      duration: 2000,
    });
    this.affirmationItem.largeImage = null;
  }

  updateCss() {

    // Horizontal positioning
    switch (this.affirmationItem.textXPos) {
      case 'l':
        this.cssClass['text-align'] = 'left';
        break;
      case 'c':
        this.cssClass['text-align'] = 'center';
        break;
      case 'r':
        this.cssClass['text-align'] = 'right';
        break;
    }
  }

  get tickInterval(): number | 'auto' {
    return this.showTicks ? (this.autoTicks ? 'auto' : this._tickInterval) : 0;
  }
  set tickInterval(value) {
    this._tickInterval = coerceNumberProperty(value);
  }
  private _tickInterval = 1;

}

