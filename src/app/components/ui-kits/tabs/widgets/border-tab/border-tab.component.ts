import { Component } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from '../../../../../shared/components/ui/card/card.component';

@Component({
  selector: 'app-border-tab',
  imports: [NgbNavModule, CardComponent],
  templateUrl: './border-tab.component.html',
  styleUrl: './border-tab.component.scss'
})

export class BorderTabComponent {

  public activeTab = 'inbox';
  
}
