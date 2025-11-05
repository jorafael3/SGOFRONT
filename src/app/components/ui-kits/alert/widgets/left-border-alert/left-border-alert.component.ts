import { Component } from '@angular/core';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from '../../../../../shared/components/ui/card/card.component';
import { FeatherIconComponent } from '../../../../../shared/components/ui/feather-icon/feather-icon.component';

@Component({
  selector: 'app-left-border-alert',
  imports: [NgbAlertModule, CardComponent, FeatherIconComponent],
  templateUrl: './left-border-alert.component.html',
  styleUrl: './left-border-alert.component.scss'
})

export class LeftBorderAlertComponent {

}
