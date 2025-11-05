import { Component } from '@angular/core';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from '../../../../../shared/components/ui/card/card.component';
import { FeatherIconComponent } from '../../../../../shared/components/ui/feather-icon/feather-icon.component';
import { outlineAccordion } from '../../../../../shared/data/ui-kits/accordion';

@Component({
  selector: 'app-outline-accordion',
  imports: [NgbAccordionModule, CardComponent, FeatherIconComponent],
  templateUrl: './outline-accordion.component.html',
  styleUrl: './outline-accordion.component.scss'
})

export class OutlineAccordionComponent {

  public outlineAccordion = outlineAccordion
}
