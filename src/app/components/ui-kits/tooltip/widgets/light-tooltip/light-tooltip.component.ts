import { Component } from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from '../../../../../shared/components/ui/card/card.component';

@Component({
  selector: 'app-light-tooltip',
  imports: [NgbTooltipModule, CardComponent],
  templateUrl: './light-tooltip.component.html',
  styleUrl: './light-tooltip.component.scss'
})

export class LightTooltipComponent {

}
