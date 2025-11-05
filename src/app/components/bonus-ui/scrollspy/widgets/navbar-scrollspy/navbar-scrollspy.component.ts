import { Component } from '@angular/core';
import { NgbDropdownModule, NgbScrollSpyModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from '../../../../../shared/components/ui/card/card.component';

@Component({
  selector: 'app-navbar-scrollspy',
  imports: [NgbScrollSpyModule, NgbDropdownModule, CardComponent],
  templateUrl: './navbar-scrollspy.component.html',
  styleUrl: './navbar-scrollspy.component.scss'
})

export class NavbarScrollspyComponent {

}
