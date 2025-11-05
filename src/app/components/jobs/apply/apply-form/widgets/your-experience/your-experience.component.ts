import { Component } from '@angular/core';
import { Select2Data, Select2Module } from 'ng-select2-component';

import { experience } from '../../../../../../shared/data/jobs/apply-form';

@Component({
  selector: 'app-your-experience',
  imports: [Select2Module],
  templateUrl: './your-experience.component.html',
  styleUrl: './your-experience.component.scss'
})

export class YourExperienceComponent {

  public experience: Select2Data = experience;

}
