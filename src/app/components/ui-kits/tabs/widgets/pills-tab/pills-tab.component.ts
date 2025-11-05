import { Component } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from '../../../../../shared/components/ui/card/card.component';

@Component({
  selector: 'app-pills-tab',
  imports: [NgbNavModule, CardComponent],
  templateUrl: './pills-tab.component.html',
  styleUrl: './pills-tab.component.scss'
})

export class PillsTabComponent {

  public activeTab = 'blog';
  
}
