import { Component } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";

@Component({
  selector: 'app-dark-dropdown',
  imports: [NgbDropdownModule, CardComponent],
  templateUrl: './dark-dropdown.component.html',
  styleUrl: './dark-dropdown.component.scss'
})

export class DarkDropdownComponent {

}
