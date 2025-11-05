import { Component } from '@angular/core';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";
import { caption } from '../../../../../shared/data/bootstrap-table';

@Component({
  selector: 'app-caption',
  imports: [CardComponent],
  templateUrl: './caption.component.html',
  styleUrl: './caption.component.scss'
})

export class CaptionComponent {

  public caption = caption;

}
