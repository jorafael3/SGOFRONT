import { Component } from '@angular/core';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from '../../../../../shared/components/ui/card/card.component';

@Component({
  selector: 'app-collapse-accordion',
  imports: [NgbCollapseModule, CardComponent],
  templateUrl: './collapse-accordion.component.html',
  styleUrl: './collapse-accordion.component.scss'
})

export class CollapseAccordionComponent {

  public isCollapsed = true;
  
}
