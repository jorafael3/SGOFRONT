import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbRatingConfig, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";

@Component({
  selector: 'app-star-rating',
  imports: [CommonModule, NgbRatingModule, CardComponent],
  templateUrl: './star-rating.component.html',
  styleUrl: './star-rating.component.scss'
})

export class StarRatingComponent {

  public rating = 2;

  constructor(private config: NgbRatingConfig) {
    this.config.readonly = false;
  }

}
