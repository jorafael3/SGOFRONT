import { Component } from '@angular/core';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from '../../../../../shared/components/ui/card/card.component';
import { SvgIconComponent } from '../../../../../shared/components/ui/svg-icon/svg-icon.component';

@Component({
  selector: 'app-custom-alert',
  imports: [NgbAlertModule, CardComponent, SvgIconComponent],
  templateUrl: './custom-alert.component.html',
  styleUrl: './custom-alert.component.scss'
})

export class CustomAlertComponent {

}
