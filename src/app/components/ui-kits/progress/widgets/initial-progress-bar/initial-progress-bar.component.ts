import { Component } from '@angular/core';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";

@Component({
  selector: 'app-initial-progress-bar',
  imports: [NgbProgressbarModule, CardComponent],
  templateUrl: './initial-progress-bar.component.html',
  styleUrl: './initial-progress-bar.component.scss'
})

export class InitialProgressBarComponent {

}
