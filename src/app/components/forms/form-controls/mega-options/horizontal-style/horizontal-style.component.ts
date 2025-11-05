import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbRatingConfig, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";
import { horizontalStyle } from '../../../../../shared/data/form-control';

@Component({
  selector: 'app-horizontal-style',
  imports: [CommonModule, NgbRatingModule, CardComponent],
  templateUrl: './horizontal-style.component.html',
  styleUrl: './horizontal-style.component.scss'
})

export class HorizontalStyleComponent {

  public horizontalStyle = horizontalStyle;

  constructor(private config: NgbRatingConfig) {
       this.config.max = 5;
       this.config.readonly = true;
    }

}
