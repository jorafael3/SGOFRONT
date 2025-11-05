import { Component } from '@angular/core';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from '../../../../../shared/components/ui/card/card.component';

@Component({
  selector: 'app-disabled-popover',
  imports: [NgbPopoverModule, CardComponent],
  templateUrl: './disabled-popover.component.html',
  styleUrl: './disabled-popover.component.scss'
})

export class DisabledPopoverComponent {

}
