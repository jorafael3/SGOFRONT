import { Component } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from '../../../../../shared/components/ui/card/card.component';

@Component({
  selector: 'app-bottom-tab',
  imports: [NgbNavModule, CardComponent],
  templateUrl: './bottom-tab.component.html',
  styleUrl: './bottom-tab.component.scss'
})

export class BottomTabComponent {

  public activeTab = 'vendors';
  
}
