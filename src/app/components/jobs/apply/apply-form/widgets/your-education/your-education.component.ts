import { Component } from '@angular/core';
import { Select2Data, Select2Module } from 'ng-select2-component';

import { degree } from '../../../../../../shared/data/jobs/apply-form';

@Component({
  selector: 'app-your-education',
  imports: [Select2Module],
  templateUrl: './your-education.component.html',
  styleUrl: './your-education.component.scss'
})

export class YourEducationComponent {

  public degree: Select2Data = degree;

}
