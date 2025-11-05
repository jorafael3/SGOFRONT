import { Component } from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { projectTeam } from '../../../../../../../shared/data/project';

@Component({
  selector: 'app-project-professional-team',
  imports: [NgbTooltipModule],
  templateUrl: './project-professional-team.component.html',
  styleUrl: './project-professional-team.component.scss'
})

export class ProjectProfessionalTeamComponent {

  public projectTeam = projectTeam;

}
