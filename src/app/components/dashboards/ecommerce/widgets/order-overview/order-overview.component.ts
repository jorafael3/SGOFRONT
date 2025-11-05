import { Component } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';

import { CardComponent } from '../../../../../shared/components/ui/card/card.component';
import { SvgIconComponent } from "../../../../../shared/components/ui/svg-icon/svg-icon.component";
import { orderOverviewBarChart, orderOverviewChart } from '../../../../../shared/data/dashboard/e-commerce';
import { cardToggleOptions3 } from '../../../../../shared/data/common';

@Component({
  selector: 'app-order-overview',
  imports: [NgApexchartsModule, CardComponent, SvgIconComponent],
  templateUrl: './order-overview.component.html',
  styleUrl: './order-overview.component.scss'
})

export class OrderOverviewComponent {

  public cardToggleOption = cardToggleOptions3;
  public orderOverviewChart = orderOverviewChart;
  public orderOverviewBarChart = orderOverviewBarChart;

}
