import { Component } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from '../../../../../shared/components/ui/card/card.component';

@Component({
  selector: 'app-icon-tab',
  imports: [NgbNavModule, CardComponent],
  templateUrl: './icon-tab.component.html',
  styleUrl: './icon-tab.component.scss'
})

export class IconTabComponent {

  public activeTab = 'home';
  
}
