import { Component } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from '../../../../../shared/components/ui/card/card.component';
import { splitDropdown } from '../../../../../shared/data/ui-kits/dropdown';

@Component({
  selector: 'app-split-dropdown',
  imports: [NgbDropdownModule, CardComponent],
  templateUrl: './split-dropdown.component.html',
  styleUrl: './split-dropdown.component.scss'
})

export class SplitDropdownComponent {

  public splitDropdown = splitDropdown;
  
}
