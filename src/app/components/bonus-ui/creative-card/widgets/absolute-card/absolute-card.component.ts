import { Component, Input } from '@angular/core';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";

import { absoluteCard } from '../../../../../shared/interface/bonus-ui/bonus-ui';

@Component({
  selector: 'app-absolute-card',
  imports: [CardComponent],
  templateUrl: './absolute-card.component.html',
  styleUrl: './absolute-card.component.scss'
})

export class AbsoluteCardComponent {

  @Input() details: absoluteCard;

}
