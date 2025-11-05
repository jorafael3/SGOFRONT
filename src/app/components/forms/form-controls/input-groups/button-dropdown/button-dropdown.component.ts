import { Component } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from '../../../../../shared/components/ui/card/card.component';

@Component({
  selector: 'app-button-dropdown',
  imports: [CardComponent, NgbDropdownModule],
  templateUrl: './button-dropdown.component.html',
  styleUrl: './button-dropdown.component.scss',
})

export class ButtonDropdownComponent {}
