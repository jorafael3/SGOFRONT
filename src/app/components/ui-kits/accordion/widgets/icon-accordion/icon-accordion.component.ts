import { Component } from '@angular/core';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from '../../../../../shared/components/ui/card/card.component';
import { FeatherIconComponent } from '../../../../../shared/components/ui/feather-icon/feather-icon.component';
import { iconAccordion } from '../../../../../shared/data/ui-kits/accordion';

@Component({
  selector: 'app-icon-accordion',
  imports: [NgbAccordionModule, CardComponent, FeatherIconComponent],
  templateUrl: './icon-accordion.component.html',
  styleUrl: './icon-accordion.component.scss'
})

export class IconAccordionComponent {

  public iconAccordion = iconAccordion;

}
