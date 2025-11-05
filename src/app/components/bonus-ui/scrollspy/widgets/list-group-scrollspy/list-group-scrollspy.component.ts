import { Component } from '@angular/core';
import { NgbScrollSpyModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";

@Component({
  selector: 'app-list-group-scrollspy',
  imports: [NgbScrollSpyModule, CardComponent],
  templateUrl: './list-group-scrollspy.component.html',
  styleUrl: './list-group-scrollspy.component.scss'
})

export class ListGroupScrollspyComponent {

}
