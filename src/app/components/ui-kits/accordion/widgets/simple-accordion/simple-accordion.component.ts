import { Component } from '@angular/core';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";
import { FeatherIconComponent } from "../../../../../shared/components/ui/feather-icon/feather-icon.component";
import { simpleAccordion } from '../../../../../shared/data/ui-kits/accordion';

@Component({
  selector: 'app-simple-accordion',
  imports: [NgbAccordionModule, CardComponent, FeatherIconComponent],
  templateUrl: './simple-accordion.component.html',
  styleUrl: './simple-accordion.component.scss'
})

export class SimpleAccordionComponent {

  public simpleAccordion = simpleAccordion;

}
