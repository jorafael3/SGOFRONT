import { Component } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";

@Component({
  selector: 'app-justify-contents',
  imports: [NgbDropdownModule, CardComponent],
  templateUrl: './justify-contents.component.html',
  styleUrl: './justify-contents.component.scss'
})

export class JustifyContentsComponent {

}
