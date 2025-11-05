import { Component } from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from '../../../../../../../shared/components/ui/card/card.component';
import { SvgIconComponent } from "../../../../../../../shared/components/ui/svg-icon/svg-icon.component";
import { projectDetails } from '../../../../../../../shared/data/project';

@Component({
  selector: 'app-team-member',
  imports: [NgbTooltipModule, CardComponent, SvgIconComponent],
  templateUrl: './team-member.component.html',
  styleUrl: './team-member.component.scss'
})

export class TeamMemberComponent {

  public teamMembers = projectDetails.project_summary.team_members;

}
