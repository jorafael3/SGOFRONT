import { Component } from '@angular/core';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

import { MyProfileComponent } from "../my-profile/my-profile.component";
import { friends } from '../../../../shared/data/social-app';

@Component({
  selector: 'app-social-app-left-panel',
  imports: [NgbAccordionModule, MyProfileComponent],
  templateUrl: './social-app-left-panel.component.html',
  styleUrl: './social-app-left-panel.component.scss'
})

export class SocialAppLeftPanelComponent {

  public friends = friends;
  
}
