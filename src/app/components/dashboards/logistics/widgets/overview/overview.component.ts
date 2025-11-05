import { Component, Input } from '@angular/core';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';

import { CardComponent } from '../../../../../shared/components/ui/card/card.component';
import { FeatherIconComponent } from "../../../../../shared/components/ui/feather-icon/feather-icon.component";
import { SvgIconComponent } from "../../../../../shared/components/ui/svg-icon/svg-icon.component";
import { Overview } from '../../../../../shared/interface/dashboard/logistics';

@Component({
  selector: 'app-overview',
  imports: [NgApexchartsModule, NgbProgressbarModule, CardComponent, 
            SvgIconComponent, FeatherIconComponent],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})

export class OverviewComponent {

  @Input() overview: Overview;

}
