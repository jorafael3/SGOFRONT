import { Component } from '@angular/core';

import { TitleCard1Component } from "./widgets/title-card-1/title-card-1.component";
import { TitleCard2Component } from "./widgets/title-card-2/title-card-2.component";
import { TitleCard3Component } from "./widgets/title-card-3/title-card-3.component";
import { BorderLeftCardComponent } from "./widgets/border-left-card/border-left-card.component";
import { BorderRightCardComponent } from "./widgets/border-right-card/border-right-card.component";
import { BorderTopCardComponent } from "./widgets/border-top-card/border-top-card.component";
import { BorderBottomCardComponent } from "./widgets/border-bottom-card/border-bottom-card.component";
import { BorderPrimaryStateComponent } from "./widgets/border-primary-state/border-primary-state.component";
import { BorderWarningStateComponent } from "./widgets/border-warning-state/border-warning-state.component";
import { BorderSecondaryStateComponent } from "./widgets/border-secondary-state/border-secondary-state.component";
import { AbsoluteCardComponent } from "./widgets/absolute-card/absolute-card.component";

import { absoluteCards } from '../../../shared/data/bonus-ui/creative-cards';

@Component({
  selector: 'app-creative-card',
  imports: [TitleCard1Component, TitleCard2Component, TitleCard3Component,
            BorderLeftCardComponent, BorderRightCardComponent, BorderTopCardComponent,
            BorderBottomCardComponent, BorderPrimaryStateComponent, BorderWarningStateComponent,
            BorderSecondaryStateComponent, AbsoluteCardComponent],
  templateUrl: './creative-card.component.html',
  styleUrl: './creative-card.component.scss'
})

export class CreativeCardComponent {

  public absoluteCards = absoluteCards;

}
