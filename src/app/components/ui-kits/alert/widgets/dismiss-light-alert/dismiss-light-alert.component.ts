import { Component } from '@angular/core';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";
import { FeatherIconComponent } from "../../../../../shared/components/ui/feather-icon/feather-icon.component";

@Component({
  selector: 'app-dismiss-light-alert',
  imports: [NgbAlertModule, CardComponent, FeatherIconComponent],
  templateUrl: './dismiss-light-alert.component.html',
  styleUrl: './dismiss-light-alert.component.scss'
})

export class DismissLightAlertComponent {

}
