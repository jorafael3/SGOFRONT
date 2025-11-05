import { Component } from '@angular/core';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";

@Component({
  selector: 'app-custom-size-progress-bar',
  imports: [NgbProgressbarModule, CardComponent],
  templateUrl: './custom-size-progress-bar.component.html',
  styleUrl: './custom-size-progress-bar.component.scss'
})

export class CustomSizeProgressBarComponent {

}
