import { Component } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from '../../../../../shared/components/ui/card/card.component';
import { roundedDropdown } from '../../../../../shared/data/ui-kits/dropdown';

@Component({
  selector: 'app-rounded-dropdown',
  imports: [NgbDropdownModule, TitleCasePipe, CardComponent],
  templateUrl: './rounded-dropdown.component.html',
  styleUrl: './rounded-dropdown.component.scss'
})

export class RoundedDropdownComponent {

  public roundedDropdown = roundedDropdown;

}
