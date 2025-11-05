import { Component } from '@angular/core';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";

@Component({
  selector: 'app-popover-directions',
  imports: [NgbPopoverModule, CardComponent],
  templateUrl: './popover-directions.component.html',
  styleUrl: './popover-directions.component.scss'
})

export class PopoverDirectionsComponent {

}
