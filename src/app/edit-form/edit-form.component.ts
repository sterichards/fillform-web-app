import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {PrismService} from '@app/Prism.service';
import {FormioOptions} from 'angular-formio';
import {NgForm} from '@angular/forms';
import {FormService} from '@app/_services/form.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-edit-form',
  templateUrl: './edit-form.component.html'
})
export class EditFormComponent implements OnInit {

  @ViewChild('json', {static: true}) jsonElement?: ElementRef;
  @ViewChild('code', {static: true}) codeElement?: ElementRef;
  formData;
  form;

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
    public snackBar: MatSnackBar,
    private route: ActivatedRoute,
  ) {}

  onChange(event) {
    this.jsonElement.nativeElement.innerHTML = '';
    this.jsonElement.nativeElement.appendChild(document.createTextNode(JSON.stringify(event.form, null, 4)));
  }

  ngOnInit() {
    this.formData = {};
    this.formData.name = '';
    this.formService.getSingle(this.route.snapshot.paramMap.get('id')).subscribe((form) => {
      this.form = form;
      console.log(this.form);
      this.formData.name = this.form.name;
    });
  }

  onSubmit(form: NgForm) {
    this.updateForm(form);
  }

  ngAfterViewInit() {
    this.prism.init();
  }

  updateForm(form) {
    this.formService.update(this.route.snapshot.paramMap.get('id'), form.value.name, this.form.components).subscribe(response => {
      this.snackBar.open('New Form' + ' has been created', '', {
        duration: 2000,
      });
      this.router.navigate(['/forms']);
    });
  }

}
