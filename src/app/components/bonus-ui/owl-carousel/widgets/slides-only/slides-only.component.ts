import { Component } from '@angular/core';
import { CarouselModule } from 'ngx-owl-carousel-o';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";

import { slidesOnly } from '../../../../../shared/data/bonus-ui/owl-carousel';

@Component({
  selector: 'app-slides-only',
  imports: [CarouselModule, CardComponent],
  templateUrl: './slides-only.component.html',
  styleUrl: './slides-only.component.scss'
})

export class SlidesOnlyComponent {

  public slidesOnly = slidesOnly;

  public options = {
    loop: true,
    mouseDrag: false,
    autoplay: true,
    dots: false,
    nav: false,
    navSpeed: 1000,
    navText: ['<i class="icon-angle-left"></i>', '<i class="icon-angle-right"></i>'],
    responsive: {
      0: {
          items: 1
      }
    },
  }

}
