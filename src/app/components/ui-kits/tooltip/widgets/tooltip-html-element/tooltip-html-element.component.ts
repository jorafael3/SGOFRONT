import { Component } from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from '../../../../../shared/components/ui/card/card.component';

@Component({
  selector: 'app-tooltip-html-element',
  imports: [NgbTooltipModule, CardComponent],
  templateUrl: './tooltip-html-element.component.html',
  styleUrl: './tooltip-html-element.component.scss'
})

export class TooltipHtmlElementComponent {

}
