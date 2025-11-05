import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { CardComponent } from '../../../../../shared/components/ui/card/card.component';
import { facebookCampaign } from '../../../../../shared/data/dashboard/social';

@Component({
  selector: 'app-facebook-campaign',
  imports: [CommonModule, CardComponent],
  templateUrl: './facebook-campaign.component.html',
  styleUrl: './facebook-campaign.component.scss'
})

export class FacebookCampaignComponent {

  public facebookCampaign = facebookCampaign;
  public showImage: number = 5;

}
