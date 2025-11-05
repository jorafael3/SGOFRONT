import { Component } from '@angular/core';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";
import { FeatherIconComponent } from "../../../../../shared/components/ui/feather-icon/feather-icon.component";

@Component({
  selector: 'app-title-card-1',
  imports: [CardComponent, FeatherIconComponent],
  templateUrl: './title-card-1.component.html',
  styleUrl: './title-card-1.component.scss'
})

export class TitleCard1Component {

}
