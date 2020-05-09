import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {PrismService} from '@app/Prism.service';
import {FormioOptions} from 'angular-formio';
import {NgForm} from '@angular/forms';
import {FormService} from '@app/_services/form.service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';


@Component({
  selector: 'app-builder',
  templateUrl: 'new-form.component.html',
  styleUrls: ['new-form.component.scss']
})
export class NewFormComponent implements OnInit {
  @ViewChild('json', {static: true}) jsonElement?: ElementRef;
  @ViewChild('code', {static: true}) codeElement?: ElementRef;
  formData;

  public form = { components: [], basic: true, advanced: false, data: false, layout: false, premium: false };
  public formOptions = {
    builder: {
      basic: false,
      advanced: false,
      layout: false,
      premium: false,
      data: false,
      customBasic: {
        title: 'Basic Components',
        default: true,
        weight: 0,
        components: {
          textfield: true,
          textarea: true,
          email: true,
          phoneNumber: true
        }
      },

      custom: {
        title: 'User Fields',
        weight: 10,

        components: {

          firstName: {
            title: 'First Name',
            key: 'firstName',
            icon: 'terminal',
            schema: {
              label: 'First Name',
              type: 'textfield',
              key: 'firstName',
              input: true
            }
          },

          lastName: {
            title: 'Last Name',
            key: 'lastName',
            icon: 'terminal',
            schema: {
              label: 'Last Name',
              type: 'textfield',
              key: 'lastName',
              input: true
            }
          },
          email: {
            title: 'Email',
            key: 'email',
            icon: 'at',
            schema: {
              label: 'Email',
              type: 'email',
              key: 'email',
              input: true
            }
          },
          phoneNumber: {
            title: 'Mobile Phone',
            key: 'mobilePhone',
            icon: 'phone-square',
            schema: {
              label: 'Mobile Phone',
              type: 'phoneNumber',
              key: 'mobilePhone',
              input: true
            }
          }
        }
      },
    },

    editForm: {
      textfield: [
        {
          key: 'api',
          ignore: true
        }
      ]
    }
  };

  constructor(
    public prism: PrismService,
    public formService: FormService,
    public router: Router,
    public snackBar: MatSnackBar
  ) {}

  onChange(event) {
    this.jsonElement.nativeElement.innerHTML = '';
    this.jsonElement.nativeElement.appendChild(document.createTextNode(JSON.stringify(event.form, null, 4)));
  }

  ngOnInit() {
    this.formData = {};
  }

  onSubmit(form: NgForm) {
    this.createForm(form);
  }

  ngAfterViewInit() {
    this.prism.init();
  }

  createForm(form) {
    this.formService.create(form.value.name, this.form.components).subscribe(response => {
      this.snackBar.open('New Form' + ' has been created', '', {
        duration: 2000,
      });
      this.router.navigate(['/forms']);
    });
  }
}
