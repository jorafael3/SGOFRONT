import { Component } from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from '../../../../../shared/components/ui/card/card.component';

@Component({
  selector: 'app-tooltip-outlined',
  imports: [NgbTooltipModule, CardComponent],
  templateUrl: './tooltip-outlined.component.html',
  styleUrl: './tooltip-outlined.component.scss'
})

export class TooltipOutlinedComponent {

}
