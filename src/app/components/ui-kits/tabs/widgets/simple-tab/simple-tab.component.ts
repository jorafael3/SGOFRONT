import { Component } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";

@Component({
  selector: 'app-simple-tab',
  imports: [NgbNavModule, CardComponent],
  templateUrl: './simple-tab.component.html',
  styleUrl: './simple-tab.component.scss'
})

export class SimpleTabComponent {

  public activeTab = 'profile';
  
}
