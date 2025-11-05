import { Component } from '@angular/core';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";
import { responsiveTable } from '../../../../../shared/data/bootstrap-table';

@Component({
  selector: 'app-responsive-table',
  imports: [CardComponent],
  templateUrl: './responsive-table.component.html',
  styleUrl: './responsive-table.component.scss'
})

export class ResponsiveTableComponent {

  public responsiveTable = responsiveTable;

}
