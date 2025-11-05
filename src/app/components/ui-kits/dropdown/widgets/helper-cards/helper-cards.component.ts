import { Component } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";

@Component({
  selector: 'app-helper-cards',
  imports: [NgbDropdownModule, CardComponent],
  templateUrl: './helper-cards.component.html',
  styleUrl: './helper-cards.component.scss'
})

export class HelperCardsComponent {

}
