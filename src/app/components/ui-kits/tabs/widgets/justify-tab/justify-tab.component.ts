import { Component } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { employees, justifyTabs } from '../../../../../shared/data/ui-kits/tabs';
import { CardComponent } from '../../../../../shared/components/ui/card/card.component';

@Component({
  selector: 'app-justify-tab',
  imports: [NgbNavModule, CardComponent],
  templateUrl: './justify-tab.component.html',
  styleUrl: './justify-tab.component.scss'
})

export class JustifyTabComponent {

  public justifyTabs = justifyTabs;
  public employees = employees;
  public activeTab = 'ux-designer';

}
