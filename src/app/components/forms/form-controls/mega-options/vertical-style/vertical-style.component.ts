import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbRatingConfig, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";
import { verticalStyle } from '../../../../../shared/data/form-control';

@Component({
  selector: 'app-vertical-style',
  imports: [CommonModule, NgbRatingModule, CardComponent],
  templateUrl: './vertical-style.component.html',
  styleUrl: './vertical-style.component.scss'
})

export class VerticalStyleComponent {

  public verticalStyle = verticalStyle;

  constructor(private config: NgbRatingConfig) {
     this.config.max = 5;
     this.config.readonly = true;
   }

}
