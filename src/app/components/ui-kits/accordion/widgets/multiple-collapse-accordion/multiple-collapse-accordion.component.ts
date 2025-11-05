import { Component } from '@angular/core';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";

@Component({
  selector: 'app-multiple-collapse-accordion',
  imports: [NgbCollapseModule, CardComponent],
  templateUrl: './multiple-collapse-accordion.component.html',
  styleUrl: './multiple-collapse-accordion.component.scss'
})

export class MultipleCollapseAccordionComponent {

  public isCollapsedFirst = true;
  public isCollapsedSecond = true;
  
}
