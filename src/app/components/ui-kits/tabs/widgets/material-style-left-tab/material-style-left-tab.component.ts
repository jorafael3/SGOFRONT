import { Component } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";

@Component({
  selector: 'app-material-style-left-tab',
  imports: [NgbNavModule, CardComponent],
  templateUrl: './material-style-left-tab.component.html',
  styleUrl: './material-style-left-tab.component.scss'
})

export class MaterialStyleLeftTabComponent {

  public activeTab = 'home';
  
}
