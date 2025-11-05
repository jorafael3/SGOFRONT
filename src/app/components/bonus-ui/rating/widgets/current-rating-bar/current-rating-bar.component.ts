import { Component } from '@angular/core';
import { BarRatingModule } from "ngx-bar-rating";

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";

@Component({
  selector: 'app-current-rating-bar',
  imports: [BarRatingModule, CardComponent],
  templateUrl: './current-rating-bar.component.html',
  styleUrl: './current-rating-bar.component.scss'
})

export class CurrentRatingBarComponent {

  public faoRate = 3;
  public faoRated = false;

  onFaoRate(e: number) {
    this.faoRated = true;
    this.faoRate = e;
  }

  faoReset() {
    this.faoRated = false;
    this.faoRate = 3;
  }

}
