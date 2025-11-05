import { Component } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";
import { basicDropdown } from '../../../../../shared/data/ui-kits/dropdown';

@Component({
  selector: 'app-basic-dropdown',
  imports: [NgbDropdownModule, CardComponent],
  templateUrl: './basic-dropdown.component.html',
  styleUrl: './basic-dropdown.component.scss'
})

export class BasicDropdownComponent {

  public basicDropdown = basicDropdown;
  
}
