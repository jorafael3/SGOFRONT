import { Component } from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from "../../../../shared/components/ui/card/card.component";
import { activityColors, userRecentActivity } from '../../../../shared/data/user';
import { ChatService } from '../../../../shared/services/chat.service';

@Component({
  selector: 'app-user-activity',
  imports: [NgbTooltipModule, CardComponent],
  templateUrl: './user-activity.component.html',
  styleUrl: './user-activity.component.scss'
})

export class UserActivityComponent {

  public userRecentActivity = userRecentActivity;
  public activityColors = activityColors;
  
  constructor(public chatService: ChatService) {}

  getColor(i: number) {
    return this.activityColors[i % this.activityColors.length];
  }
  
}
