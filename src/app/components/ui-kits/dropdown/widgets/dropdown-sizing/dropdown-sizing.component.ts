import { Component } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from '../../../../../shared/components/ui/card/card.component';

@Component({
  selector: 'app-dropdown-sizing',
  imports: [NgbDropdownModule, CardComponent],
  templateUrl: './dropdown-sizing.component.html',
  styleUrl: './dropdown-sizing.component.scss'
})

export class DropdownSizingComponent {

}
