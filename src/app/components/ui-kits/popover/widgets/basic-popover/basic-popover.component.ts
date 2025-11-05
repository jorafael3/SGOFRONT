import { Component } from '@angular/core';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";

@Component({
  selector: 'app-basic-popover',
  imports: [NgbPopoverModule, CardComponent],
  templateUrl: './basic-popover.component.html',
  styleUrl: './basic-popover.component.scss'
})

export class BasicPopoverComponent {

}
