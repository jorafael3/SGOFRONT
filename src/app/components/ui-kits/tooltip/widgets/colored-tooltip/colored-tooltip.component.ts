import { Component } from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";

@Component({
  selector: 'app-colored-tooltip',
  imports: [NgbTooltipModule, CardComponent],
  templateUrl: './colored-tooltip.component.html',
  styleUrl: './colored-tooltip.component.scss'
})

export class ColoredTooltipComponent {

}
