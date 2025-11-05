import { Component, Input } from '@angular/core';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";
import { SchoolDetails } from '../../../../../shared/interface/dashboard/school-management';

@Component({
  selector: 'app-school-details',
  imports: [CardComponent],
  templateUrl: './school-details.component.html',
  styleUrl: './school-details.component.scss'
})

export class SchoolDetailsComponent {

  @Input() details: SchoolDetails;

}
