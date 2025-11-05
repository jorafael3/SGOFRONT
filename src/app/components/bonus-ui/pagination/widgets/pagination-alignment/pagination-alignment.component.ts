import { Component } from '@angular/core';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";

import { paginationAlignment } from '../../../../../shared/data/bonus-ui/pagination';

@Component({
  selector: 'app-pagination-alignment',
  imports: [CardComponent],
  templateUrl: './pagination-alignment.component.html',
  styleUrl: './pagination-alignment.component.scss'
})

export class PaginationAlignmentComponent {

  public paginationAlignment = paginationAlignment;

}
