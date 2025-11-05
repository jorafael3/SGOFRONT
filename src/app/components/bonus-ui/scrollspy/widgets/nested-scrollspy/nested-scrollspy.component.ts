import { Component } from '@angular/core';
import { NgbScrollSpyModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";
import { SvgIconComponent } from "../../../../../shared/components/ui/svg-icon/svg-icon.component";

@Component({
  selector: 'app-nested-scrollspy',
  imports: [NgbScrollSpyModule, CardComponent, SvgIconComponent],
  templateUrl: './nested-scrollspy.component.html',
  styleUrl: './nested-scrollspy.component.scss'
})

export class NestedScrollspyComponent {

}
