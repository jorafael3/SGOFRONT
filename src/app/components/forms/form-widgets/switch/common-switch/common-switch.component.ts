import { Component } from '@angular/core';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";
import { commonSwitch } from '../../../../../shared/data/form-widgets';

@Component({
  selector: 'app-common-switch',
  imports: [CardComponent],
  templateUrl: './common-switch.component.html',
  styleUrl: './common-switch.component.scss'
})

export class CommonSwitchComponent {

  public commonSwitch = commonSwitch;

}
