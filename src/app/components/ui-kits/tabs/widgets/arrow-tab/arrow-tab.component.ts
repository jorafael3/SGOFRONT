import { Component } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from '../../../../../shared/components/ui/card/card.component';

@Component({
  selector: 'app-arrow-tab',
  imports: [NgbNavModule, CardComponent],
  templateUrl: './arrow-tab.component.html',
  styleUrl: './arrow-tab.component.scss'
})

export class ArrowTabComponent {

  public activeTab = 'portfolio';
  
}
