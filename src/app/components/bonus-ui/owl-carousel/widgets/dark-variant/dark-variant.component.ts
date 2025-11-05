import { Component } from '@angular/core';
import { CarouselModule } from 'ngx-owl-carousel-o';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";

import { darkVariant } from '../../../../../shared/data/bonus-ui/owl-carousel';

@Component({
  selector: 'app-dark-variant',
  imports: [CarouselModule, CardComponent],
  templateUrl: './dark-variant.component.html',
  styleUrl: './dark-variant.component.scss'
})

export class DarkVariantComponent {

  public darkVariant  = darkVariant;

  public options = {
    loop: true,
    mouseDrag: false,
    autoplay: true,
    dots: true,
    nav: true,
    navSpeed: 1000,
    navText: ['<i class="icon-angle-left"></i>', '<i class="icon-angle-right"></i>'],
    responsive: {
      0: {
        items: 1
      }
    },
  }

}
