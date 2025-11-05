import { Component } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";

@Component({
  selector: 'app-divider-dropdown',
  imports: [NgbDropdownModule, CardComponent],
  templateUrl: './divider-dropdown.component.html',
  styleUrl: './divider-dropdown.component.scss'
})

export class DividerDropdownComponent {

}
