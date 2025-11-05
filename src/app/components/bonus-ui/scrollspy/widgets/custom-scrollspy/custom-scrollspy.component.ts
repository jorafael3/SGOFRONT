import { Component } from '@angular/core';
import { NgbScrollSpyModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";
import { SvgIconComponent } from "../../../../../shared/components/ui/svg-icon/svg-icon.component";

@Component({
  selector: 'app-custom-scrollspy',
  imports: [NgbScrollSpyModule, CardComponent, SvgIconComponent],
  templateUrl: './custom-scrollspy.component.html',
  styleUrl: './custom-scrollspy.component.scss'
})

export class CustomScrollspyComponent {

}
