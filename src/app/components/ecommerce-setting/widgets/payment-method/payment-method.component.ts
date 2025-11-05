import { Component } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-payment-method',
  imports: [NgbNavModule],
  templateUrl: './payment-method.component.html',
  styleUrl: './payment-method.component.scss'
})

export class PaymentMethodComponent {

  public active = 'paypal';

}
