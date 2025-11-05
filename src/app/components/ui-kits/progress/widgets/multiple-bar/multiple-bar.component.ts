import { Component } from '@angular/core';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";

@Component({
  selector: 'app-multiple-bar',
  imports: [NgbProgressbarModule, CardComponent],
  templateUrl: './multiple-bar.component.html',
  styleUrl: './multiple-bar.component.scss'
})

export class MultipleBarComponent {

}
