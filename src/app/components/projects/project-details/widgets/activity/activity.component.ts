import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { CardDropdownButtonComponent } from "../../../../../shared/components/ui/card/card-dropdown-button/card-dropdown-button.component";
import { CardComponent } from "../../../../../shared/components/ui/card/card.component";
import { SvgIconComponent } from "../../../../../shared/components/ui/svg-icon/svg-icon.component";
import { cardToggleOptions1 } from '../../../../../shared/data/common';
import { projectDetails } from '../../../../../shared/data/project';
import { ChatService } from '../../../../../shared/services/chat.service';

@Component({
  selector: 'app-activity',
  imports: [RouterModule, NgbTooltipModule, CardComponent, CardDropdownButtonComponent, SvgIconComponent],
  templateUrl: './activity.component.html',
  styleUrl: './activity.component.scss'
})

export class ActivityComponent {

  public cardToggleOption = cardToggleOptions1;
  public projectActivity = projectDetails.activity;

  constructor(public chatService: ChatService) {}

}
