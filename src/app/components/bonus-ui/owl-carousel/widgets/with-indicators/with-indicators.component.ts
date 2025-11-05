import { Component } from '@angular/core';
import { CarouselModule } from 'ngx-owl-carousel-o';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";

import { withIndicators } from '../../../../../shared/data/bonus-ui/owl-carousel';

@Component({
  selector: 'app-with-indicators',
  imports: [CarouselModule, CardComponent],
  templateUrl: './with-indicators.component.html',
  styleUrl: './with-indicators.component.scss'
})

export class WithIndicatorsComponent {

  public withIndicators = withIndicators;

  public options = {
    loop: true,
    autoplay : true,
    mouseDrag: false,
    dots: false,
    nav: true,
    navSpeed: 700,
    navText: ['<i class="icon-angle-left"></i>', '<i class="icon-angle-right"></i>'],
    center: true,
    items: 1
  }

}
