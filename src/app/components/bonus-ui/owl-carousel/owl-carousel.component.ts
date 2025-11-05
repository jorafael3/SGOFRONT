import { Component } from '@angular/core';

import { SlidesOnlyComponent } from "./widgets/slides-only/slides-only.component";
import { WithControlsComponent } from "./widgets/with-controls/with-controls.component";
import { WithIndicatorsComponent } from "./widgets/with-indicators/with-indicators.component";
import { WithCaptionComponent } from "./widgets/with-caption/with-caption.component";
import { CrossFadeComponent } from "./widgets/cross-fade/cross-fade.component";
import { IndividualItemComponent } from "./widgets/individual-item/individual-item.component";
import { DisableTouchComponent } from "./widgets/disable-touch/disable-touch.component";
import { DarkVariantComponent } from "./widgets/dark-variant/dark-variant.component";
import { VerticalSliderComponent } from "./widgets/vertical-slider/vertical-slider.component";
import { NestedSwiperComponent } from "./widgets/nested-swiper/nested-swiper.component";
import { MouseWheelVariantComponent } from "./widgets/mouse-wheel-variant/mouse-wheel-variant.component";
import { AutoPlayVariantComponent } from "./widgets/auto-play-variant/auto-play-variant.component";

@Component({
  selector: 'app-owl-carousel',
  imports: [SlidesOnlyComponent, WithControlsComponent, WithIndicatorsComponent,
            WithCaptionComponent, CrossFadeComponent, IndividualItemComponent,
            DisableTouchComponent, DarkVariantComponent, VerticalSliderComponent,
            NestedSwiperComponent, MouseWheelVariantComponent, AutoPlayVariantComponent],
  templateUrl: './owl-carousel.component.html',
  styleUrl: './owl-carousel.component.scss'
})

export class OwlCarouselComponent {

}
