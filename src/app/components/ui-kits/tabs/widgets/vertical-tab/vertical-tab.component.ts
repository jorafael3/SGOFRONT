import { Component } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from '../../../../../shared/components/ui/card/card.component';

@Component({
  selector: 'app-vertical-tab',
  imports: [NgbNavModule, CardComponent],
  templateUrl: './vertical-tab.component.html',
  styleUrl: './vertical-tab.component.scss'
})

export class VerticalTabComponent {

  public activeTab = 'components';
  
}
