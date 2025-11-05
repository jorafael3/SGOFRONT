import { Component } from '@angular/core';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";

@Component({
  selector: 'app-alerts',
  imports: [CardComponent,NgbAlertModule],
  templateUrl: './alerts.component.html',
  styleUrl: './alerts.component.scss'
})

export class AlertsComponent {


}
