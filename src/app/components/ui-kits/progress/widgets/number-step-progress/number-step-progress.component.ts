import { Component } from '@angular/core';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";

@Component({
  selector: 'app-number-step-progress',
  imports: [NgbProgressbarModule, CardComponent],
  templateUrl: './number-step-progress.component.html',
  styleUrl: './number-step-progress.component.scss'
})

export class NumberStepProgressComponent {

}
