import { Component } from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from '../../../../../shared/components/ui/card/card.component';

@Component({
  selector: 'app-disabled-tooltip',
  imports: [NgbTooltipModule, CardComponent],
  templateUrl: './disabled-tooltip.component.html',
  styleUrl: './disabled-tooltip.component.scss'
})

export class DisabledTooltipComponent {

}
