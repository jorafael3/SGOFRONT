import { Component } from '@angular/core';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";

@Component({
  selector: 'app-alerts-icon',
  imports: [NgbAlertModule, CardComponent],
  templateUrl: './alerts-icon.component.html',
  styleUrl: './alerts-icon.component.scss'
})

export class AlertsIconComponent {

  public showWarningAlert = true;
  public showDangerAlert = true;
  public isCheckButtonClicked = false;
  public isAlertButtonClicked = false;

  onCloseWarningAlert() {
    this.showWarningAlert = false;
  }

  onCloseDangerAlert() {
    this.showDangerAlert = false;
  }

  onCheckButtonClicked() {
    this.isCheckButtonClicked = true;
    this.onCloseWarningAlert();
  }

  onAlertButtonClicked() {
    this.isAlertButtonClicked = true;
    this.onCloseDangerAlert();
  }
  
}
