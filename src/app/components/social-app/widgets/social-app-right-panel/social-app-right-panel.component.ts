import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbAccordionModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { friends, myProfile } from '../../../../shared/data/social-app';

@Component({
  selector: 'app-social-app-right-panel',
  imports: [CommonModule, NgbAccordionModule, NgbTooltipModule],
  templateUrl: './social-app-right-panel.component.html',
  styleUrl: './social-app-right-panel.component.scss'
})

export class SocialAppRightPanelComponent {

  public myProfile = myProfile;
  public friends = friends;
  
}
