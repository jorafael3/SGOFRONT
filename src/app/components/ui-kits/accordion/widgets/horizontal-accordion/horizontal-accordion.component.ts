import { Component } from '@angular/core';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from '../../../../../shared/components/ui/card/card.component';

@Component({
  selector: 'app-horizontal-accordion',
  imports: [NgbCollapseModule, CardComponent],
  templateUrl: './horizontal-accordion.component.html',
  styleUrl: './horizontal-accordion.component.scss'
})

export class HorizontalAccordionComponent {

  public isCollapsed = true;

}
