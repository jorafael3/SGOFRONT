import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CardComponent } from '../../../shared/components/ui/card/card.component';
import { FeatherIconComponent } from "../../../shared/components/ui/feather-icon/feather-icon.component";
import { BestSellersComponent } from "./widgets/best-sellers/best-sellers.component";
import { DetailsComponent } from './widgets/details/details.component';
import { MonthOrderComponent } from "./widgets/month-order/month-order.component";
import { MonthlyProfitsComponent } from './widgets/monthly-profits/monthly-profits.component';
import { OrderOverviewComponent } from "./widgets/order-overview/order-overview.component";
import { PaymentGatewayEarningComponent } from './widgets/payment-gateway-earning/payment-gateway-earning.component';
import { RecentActivityComponent } from "./widgets/recent-activity/recent-activity.component";
import { RecentOrdersComponent } from './widgets/recent-orders/recent-orders.component';
import { RecentTransactionsComponent } from "./widgets/recent-transactions/recent-transactions.component";
import { StockReportsComponent } from "./widgets/stock-reports/stock-reports.component";
import { TopCategoriesComponent } from "./widgets/top-categories/top-categories.component";
import { TopCustomersComponent } from './widgets/top-customers/top-customers.component';
import { TotalEarningsComponent } from "./widgets/total-earnings/total-earnings.component";
import { TrendingProductsComponent } from "./widgets/trending-products/trending-products.component";
import { WebsiteTrafficComponent } from "./widgets/website-traffic/website-traffic.component";

import { details } from '../../../shared/data/dashboard/e-commerce';

@Component({
  selector: 'app-ecommerce',
  imports: [RouterModule, TotalEarningsComponent, DetailsComponent, TopCustomersComponent,
            MonthOrderComponent, MonthlyProfitsComponent, RecentTransactionsComponent,
            WebsiteTrafficComponent, RecentOrdersComponent, TopCategoriesComponent,
            CardComponent, RecentActivityComponent, OrderOverviewComponent, 
            StockReportsComponent, BestSellersComponent, PaymentGatewayEarningComponent, 
            TrendingProductsComponent, FeatherIconComponent],
  templateUrl: './ecommerce.component.html',
  styleUrl: './ecommerce.component.scss'
})
export class EcommerceComponent {

  public tilesDetails = details;

}
