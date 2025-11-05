import { Component } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from '../../../../../shared/components/ui/card/card.component';

@Component({
  selector: 'app-material-style-tab',
  imports: [NgbNavModule, CardComponent],
  templateUrl: './material-style-tab.component.html',
  styleUrl: './material-style-tab.component.scss'
})

export class MaterialStyleTabComponent {

  public activeTab = 'user';
  
}
