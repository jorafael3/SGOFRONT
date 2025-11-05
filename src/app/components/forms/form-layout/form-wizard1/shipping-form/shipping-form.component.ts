import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";
import { CompletedComponent } from "../../../../checkout/widgets/completed/completed.component";
import { InformationComponent } from "../../../../checkout/widgets/information/information.component";
import { PaymentComponent } from "../../../../checkout/widgets/payment/payment.component";
import { ShippingComponent } from "../../../../checkout/widgets/shipping/shipping.component";

import { productDetails, productTotal, shippingForm } from '../../../../../shared/data/form-layout';

@Component({
  selector: 'app-shipping-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule,
            NgbNavModule, InformationComponent, ShippingComponent,
            PaymentComponent, CompletedComponent, CardComponent],
  templateUrl: './shipping-form.component.html',
  styleUrl: './shipping-form.component.scss'
})

export class ShippingFormComponent {

  public shippingForm = shippingForm;
  public productDetails = productDetails;
  public productTotal = productTotal;
  public activeTab: number = 1;

  handleStep(value: number) {
    if (value == -1) {
      this.activeTab = this.activeTab - 1;
    } else if (value == 1 && this.activeTab < this.shippingForm.length) {
      this.activeTab = this.activeTab + 1;
    }
  }

}
