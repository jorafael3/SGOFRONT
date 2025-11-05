import { Component } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";

@Component({
  selector: 'app-heading-dropdown',
  imports: [NgbDropdownModule, CardComponent],
  templateUrl: './heading-dropdown.component.html',
  styleUrl: './heading-dropdown.component.scss'
})

export class HeadingDropdownComponent {

}
