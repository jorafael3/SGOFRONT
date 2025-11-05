import { Component } from '@angular/core';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";

@Component({
  selector: 'app-live-alert',
  imports: [NgbAlertModule, CardComponent],
  templateUrl: './live-alert.component.html',
  styleUrl: './live-alert.component.scss'
})

export class LiveAlertComponent {

  public alerts = Array.from({ length: 0 }, (_, index) => index);

  addAlert() {
    this.alerts.push(this.alerts.length + 1)
  }

  close(i: number) {
    this.alerts.splice(this.alerts.indexOf(i), 1);
  }
  
}
