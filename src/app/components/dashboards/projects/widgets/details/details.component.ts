import { Component, Input } from '@angular/core';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";
import { SvgIconComponent } from "../../../../../shared/components/ui/svg-icon/svg-icon.component";
import { ProjectDetails } from '../../../../../shared/interface/dashboard/projects';

@Component({
  selector: 'app-details',
  imports: [CardComponent, SvgIconComponent],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})

export class DetailsComponent {

  @Input() details: ProjectDetails;

}
