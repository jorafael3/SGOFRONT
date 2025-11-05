import { Component } from '@angular/core';
import { CarouselModule } from 'ngx-owl-carousel-o';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";

import { individual } from '../../../../../shared/data/bonus-ui/owl-carousel';

@Component({
  selector: 'app-individual-item',
  imports: [CarouselModule, CardComponent],
  templateUrl: './individual-item.component.html',
  styleUrl: './individual-item.component.scss'
})

export class IndividualItemComponent {

  public individual = individual;

  public options = {
    loop: true,
    mouseDrag: false,
    autoplay: true,
    dots: true,
    nav: true,
    navSpeed: 1000,
    setInterval: true,
    navText: ['<i class="icon-angle-left"></i>', '<i class="icon-angle-right"></i>'],
    responsive: {
      0: {
        items: 1
      }
    },
  }

}
