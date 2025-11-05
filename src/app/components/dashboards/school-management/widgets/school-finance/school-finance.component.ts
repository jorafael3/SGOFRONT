import { Component } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";
import { schoolFinance } from '../../../../../shared/data/dashboard/school-management';
import { cardToggleOptions3 } from '../../../../../shared/data/common';

@Component({
  selector: 'app-school-finance',
  imports: [NgApexchartsModule, CardComponent],
  templateUrl: './school-finance.component.html',
  styleUrl: './school-finance.component.scss'
})

export class SchoolFinanceComponent {

  public schoolFinance = schoolFinance;
  public cardToggleOption = cardToggleOptions3;

}
