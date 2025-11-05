import { Component } from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from '../../../../../shared/components/ui/card/card.component';

@Component({
  selector: 'app-tooltip-direction',
  imports: [NgbTooltipModule, CardComponent],
  templateUrl: './tooltip-direction.component.html',
  styleUrl: './tooltip-direction.component.scss'
})

export class TooltipDirectionComponent {

}
