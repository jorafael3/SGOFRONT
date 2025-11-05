import { Component } from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { sellerDetails } from '../../../../../shared/data/store';

@Component({
  selector: 'app-seller-notifications',
  imports: [NgbTooltipModule],
  templateUrl: './seller-notifications.component.html',
  styleUrl: './seller-notifications.component.scss'
})

export class SellerNotificationsComponent {

  public notifications = sellerDetails.notifications;

}
