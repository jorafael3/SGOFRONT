import { Component } from '@angular/core';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";

import { paginationSizing } from '../../../../../shared/data/bonus-ui/pagination';

@Component({
  selector: 'app-pagination-sizing',
  imports: [CardComponent],
  templateUrl: './pagination-sizing.component.html',
  styleUrl: './pagination-sizing.component.scss'
})
export class PaginationSizingComponent {

  public paginationSizing = paginationSizing;

}
