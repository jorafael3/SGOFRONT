import { Component } from '@angular/core';
import { CarouselModule } from 'ngx-owl-carousel-o';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";

import { withCaption } from '../../../../../shared/data/bonus-ui/owl-carousel';

@Component({
  selector: 'app-with-caption',
  imports: [CarouselModule, CardComponent],
  templateUrl: './with-caption.component.html',
  styleUrl: './with-caption.component.scss'
})

export class WithCaptionComponent {

  public withCaption = withCaption;

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
