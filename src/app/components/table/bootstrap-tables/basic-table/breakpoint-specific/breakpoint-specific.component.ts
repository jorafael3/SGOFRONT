import { Component } from '@angular/core';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";
import { breakpointTable } from '../../../../../shared/data/bootstrap-table';

@Component({
  selector: 'app-breakpoint-specific',
  imports: [CardComponent],
  templateUrl: './breakpoint-specific.component.html',
  styleUrl: './breakpoint-specific.component.scss'
})

export class BreakpointSpecificComponent {

  public breakpointTable = breakpointTable;

}
