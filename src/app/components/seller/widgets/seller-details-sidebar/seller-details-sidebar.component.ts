import { Component } from '@angular/core';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

import { SellerDetailsComponent } from "./seller-details/seller-details.component";
import { SellerNotificationsComponent } from "./seller-notifications/seller-notifications.component";
import { SellerPoliciesComponent } from "./seller-policies/seller-policies.component";
import { SellerProductReviewComponent } from "./seller-product-review/seller-product-review.component";
import { SellerRatingComponent } from "./seller-rating/seller-rating.component";

@Component({
  selector: 'app-seller-details-sidebar',
  imports: [NgbAccordionModule, SellerDetailsComponent, SellerRatingComponent,
            SellerNotificationsComponent, SellerPoliciesComponent, SellerProductReviewComponent],
  templateUrl: './seller-details-sidebar.component.html',
  styleUrl: './seller-details-sidebar.component.scss'
})

export class SellerDetailsSidebarComponent {

  public sidebarOpen: boolean = false;

  toggleSidebar() {
    this.sidebarOpen =! this.sidebarOpen;
  }
  
}
