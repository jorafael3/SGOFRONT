import { Component } from '@angular/core';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";

@Component({
  selector: 'app-custom-progress-bar',
  imports: [NgbProgressbarModule, CardComponent],
  templateUrl: './custom-progress-bar.component.html',
  styleUrl: './custom-progress-bar.component.scss'
})

export class CustomProgressBarComponent {

}
