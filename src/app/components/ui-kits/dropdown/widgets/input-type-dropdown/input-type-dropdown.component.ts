import { Component } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";

@Component({
  selector: 'app-input-type-dropdown',
  imports: [NgbDropdownModule, CardComponent],
  templateUrl: './input-type-dropdown.component.html',
  styleUrl: './input-type-dropdown.component.scss'
})

export class InputTypeDropdownComponent {

}
