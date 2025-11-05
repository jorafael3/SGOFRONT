import { Component } from '@angular/core';
import { CarouselModule } from 'ngx-owl-carousel-o';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";

import { disable } from '../../../../../shared/data/bonus-ui/owl-carousel';

@Component({
  selector: 'app-disable-touch',
  imports: [CarouselModule, CardComponent],
  templateUrl: './disable-touch.component.html',
  styleUrl: './disable-touch.component.scss'
})

export class DisableTouchComponent {

  public disable = disable;

  public options = {
    loop: true,
    mouseDrag: false,
    autoplay: false,
    dots: false,
    nav: true,
    navSpeed: 1000,
    disable: true,
    navText: ['<i class="icon-angle-left"></i>', '<i class="icon-angle-right"></i>'],
    responsive: {
      0: {
          items: 1
      }
    },
  }

}
