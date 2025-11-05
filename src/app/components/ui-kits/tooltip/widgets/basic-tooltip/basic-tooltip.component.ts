import { Component } from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";

@Component({
  selector: 'app-basic-tooltip',
  imports: [NgbTooltipModule, CardComponent],
  templateUrl: './basic-tooltip.component.html',
  styleUrl: './basic-tooltip.component.scss'
})

export class BasicTooltipComponent {

}
