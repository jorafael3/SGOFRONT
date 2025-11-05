import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbAccordionModule, NgbModule, NgbRatingConfig, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from "../../../../shared/components/ui/card/card.component";
import { FeatherIconComponent } from "../../../../shared/components/ui/feather-icon/feather-icon.component";
import { companiesSidebar } from '../../../../shared/data/jobs/companies';

@Component({
  selector: 'app-companies-filter',
  imports: [CommonModule, NgbAccordionModule, NgbModule, NgbRatingModule, 
    CardComponent, FeatherIconComponent],
  templateUrl: './companies-filter.component.html',
  styleUrl: './companies-filter.component.scss'
})

export class CompaniesFilterComponent {

  public sidebar = companiesSidebar;
  public isOpen: boolean = false;

  constructor(public config: NgbRatingConfig) {
    config.max = 5;
    config.readonly = true;
  }

  openSidebar(){
    this.isOpen =! this.isOpen;
  }

}
