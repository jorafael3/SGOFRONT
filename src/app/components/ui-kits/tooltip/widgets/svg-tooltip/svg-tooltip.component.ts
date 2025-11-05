import { Component } from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";
import { SvgIconComponent } from '../../../../../shared/components/ui/svg-icon/svg-icon.component';

@Component({
  selector: 'app-svg-tooltip',
  imports: [NgbTooltipModule, CardComponent, SvgIconComponent],
  templateUrl: './svg-tooltip.component.html',
  styleUrl: './svg-tooltip.component.scss'
})

export class SvgTooltipComponent {

}
