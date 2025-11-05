import { Component } from '@angular/core';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from '../../../../../shared/components/ui/card/card.component';
import { FeatherIconComponent } from '../../../../../shared/components/ui/feather-icon/feather-icon.component';
import { flushAccordion } from '../../../../../shared/data/ui-kits/accordion';

@Component({
  selector: 'app-flush-accordion',
  imports: [NgbAccordionModule, CardComponent, FeatherIconComponent],
  templateUrl: './flush-accordion.component.html',
  styleUrl: './flush-accordion.component.scss'
})

export class FlushAccordionComponent {

  public flushAccordion = flushAccordion;

}
