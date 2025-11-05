import { Component } from '@angular/core';

import { CardDropdownButtonComponent } from "../../../../../shared/components/ui/card/card-dropdown-button/card-dropdown-button.component";
import { leadSource } from '../../../../../shared/data/dashboard/crm';
import { cardToggleOptions5 } from '../../../../../shared/data/common';

@Component({
  selector: 'app-lead-source',
  imports: [CardDropdownButtonComponent],
  templateUrl: './lead-source.component.html',
  styleUrl: './lead-source.component.scss'
})

export class LeadSourceComponent {

  public leadSource = leadSource;
  public cardToggleOption = cardToggleOptions5;

}
