import { Component } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';

import { CardComponent } from "../../../../shared/components/ui/card/card.component";
import { SvgIconComponent } from "../../../../shared/components/ui/svg-icon/svg-icon.component";
import { cardToggleOptions1 } from '../../../../shared/data/common';
import { salesOverviewCharts } from '../../../../shared/data/store';

@Component({
  selector: 'app-sales-overview',
  imports: [NgbNavModule, NgApexchartsModule, CardComponent, SvgIconComponent],
  templateUrl: './sales-overview.component.html',
  styleUrl: './sales-overview.component.scss'
})

export class SalesOverviewComponent {

  public cardToggleOption = cardToggleOptions1;
  public salesOverviewCharts = salesOverviewCharts;
  public activeTab: string = 'earning';

}
