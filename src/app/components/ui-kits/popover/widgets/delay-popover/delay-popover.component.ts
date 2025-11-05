import { Component } from '@angular/core';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from '../../../../../shared/components/ui/card/card.component';

@Component({
  selector: 'app-delay-popover',
  imports: [NgbPopoverModule, CardComponent],
  templateUrl: './delay-popover.component.html',
  styleUrl: './delay-popover.component.scss'
})

export class DelayPopoverComponent {

}
