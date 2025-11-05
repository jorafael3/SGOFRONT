import { Component } from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from '../../../../../shared/components/ui/card/card.component';

@Component({
  selector: 'app-icon-tooltip',
  imports: [NgbTooltipModule, CardComponent],
  templateUrl: './icon-tooltip.component.html',
  styleUrl: './icon-tooltip.component.scss'
})

export class IconTooltipComponent {

}
