import { Component } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from '../../../../../shared/components/ui/card/card.component';

@Component({
  selector: 'app-animated-tab',
  imports: [NgbNavModule, CardComponent],
  templateUrl: './animated-tab.component.html',
  styleUrl: './animated-tab.component.scss'
})

export class AnimatedTabComponent {

  public activeTab = 'profile';
  
}
