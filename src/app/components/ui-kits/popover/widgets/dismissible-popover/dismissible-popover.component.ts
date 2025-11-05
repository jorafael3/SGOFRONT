import { Component } from '@angular/core';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from '../../../../../shared/components/ui/card/card.component';

@Component({
  selector: 'app-dismissible-popover',
  imports: [NgbPopoverModule, CardComponent],
  templateUrl: './dismissible-popover.component.html',
  styleUrl: './dismissible-popover.component.scss'
})

export class DismissiblePopoverComponent {

}
