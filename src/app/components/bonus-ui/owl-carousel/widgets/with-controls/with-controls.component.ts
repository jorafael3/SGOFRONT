import { Component } from '@angular/core';
import { CarouselModule } from 'ngx-owl-carousel-o';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";

import { withControls } from '../../../../../shared/data/bonus-ui/owl-carousel';

@Component({
  selector: 'app-with-controls',
  imports: [CarouselModule, CardComponent],
  templateUrl: './with-controls.component.html',
  styleUrl: './with-controls.component.scss'
})

export class WithControlsComponent {

  public withControls = withControls;

  public options = {
    loop: true,
    mouseDrag: false,
    autoplay: true,
    dots: false,
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
