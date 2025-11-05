import { Component } from '@angular/core';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from '../../../../../shared/components/ui/card/card.component';

@Component({
  selector: 'app-animated-progress-bar',
  imports: [NgbProgressbarModule, CardComponent],
  templateUrl: './animated-progress-bar.component.html',
  styleUrl: './animated-progress-bar.component.scss'
})

export class AnimatedProgressBarComponent {

}
