import { Component } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from '../../../../../shared/components/ui/card/card.component';

@Component({
  selector: 'app-background-pill-tab',
  imports: [NgbNavModule, CardComponent],
  templateUrl: './background-pill-tab.component.html',
  styleUrl: './background-pill-tab.component.scss'
})

export class BackgroundPillTabComponent {

  public activeTab = 'tables';
}
