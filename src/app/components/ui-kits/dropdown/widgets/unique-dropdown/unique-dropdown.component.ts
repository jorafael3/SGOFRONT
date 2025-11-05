import { Component } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from '../../../../../shared/components/ui/card/card.component';

@Component({
  selector: 'app-unique-dropdown',
  imports: [NgbDropdownModule, CardComponent],
  templateUrl: './unique-dropdown.component.html',
  styleUrl: './unique-dropdown.component.scss'
})

export class UniqueDropdownComponent {

}
