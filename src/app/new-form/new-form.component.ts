import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {PrismService} from '@app/Prism.service';


@Component({
  selector: 'app-builder',
  templateUrl: 'new-form.component.html',
  styleUrls: ['new-form.component.scss']
})
export class NewFormComponent {
  @ViewChild('json', {static: true}) jsonElement?: ElementRef;
  @ViewChild('code', {static: true}) codeElement?: ElementRef;
  public form: Object;
  constructor(public prism: PrismService) {
    this.form = {components: []};
  }

  onChange(event) {
    this.jsonElement.nativeElement.innerHTML = '';
    this.jsonElement.nativeElement.appendChild(document.createTextNode(JSON.stringify(event.form, null, 4)));
  }

  ngAfterViewInit() {
    this.prism.init();
  }
}
