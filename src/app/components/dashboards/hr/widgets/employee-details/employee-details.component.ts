import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { CardComponent } from '../../../../../shared/components/ui/card/card.component';
import { SvgIconComponent } from "../../../../../shared/components/ui/svg-icon/svg-icon.component";
import { EmployeeDetails } from '../../../../../shared/interface/dashboard/hr';

@Component({
  selector: 'app-employee-details',
  imports: [CommonModule, CardComponent, SvgIconComponent],
  templateUrl: './employee-details.component.html',
  styleUrl: './employee-details.component.scss'
})

export class EmployeeDetailsComponent {

  @Input() details: EmployeeDetails;

}
