import { Component } from '@angular/core';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";

@Component({
  selector: 'app-progressbar',
  imports: [NgbProgressbarModule, CardComponent],
  templateUrl: './progressbar.component.html',
  styleUrl: './progressbar.component.scss'
})

export class ProgressbarComponent {

}
