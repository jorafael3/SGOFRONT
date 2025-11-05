import { Component } from '@angular/core';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";

@Component({
  selector: 'app-striped-progress-bar',
  imports: [NgbProgressbarModule, CardComponent],
  templateUrl: './striped-progress-bar.component.html',
  styleUrl: './striped-progress-bar.component.scss'
})

export class StripedProgressBarComponent {

}
