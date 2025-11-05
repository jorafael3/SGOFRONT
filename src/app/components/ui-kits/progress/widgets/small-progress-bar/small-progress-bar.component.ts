import { Component } from '@angular/core';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";

@Component({
  selector: 'app-small-progress-bar',
  imports: [NgbProgressbarModule, CardComponent],
  templateUrl: './small-progress-bar.component.html',
  styleUrl: './small-progress-bar.component.scss'
})

export class SmallProgressBarComponent {

}
