import { Component } from '@angular/core';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";
import { student } from '../../../../../shared/data/bootstrap-table';

@Component({
  selector: 'app-bootstrap-table-with-variants',
  imports: [CardComponent],
  templateUrl: './bootstrap-table-with-variants.component.html',
  styleUrl: './bootstrap-table-with-variants.component.scss'
})

export class BootstrapTableWithVariantsComponent {

  public student = student;

}
