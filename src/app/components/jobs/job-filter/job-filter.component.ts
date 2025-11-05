import { Component } from '@angular/core';
import { NgbAccordionModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FeatherIconComponent } from "../../../shared/components/ui/feather-icon/feather-icon.component";
import { sidebars } from '../../../shared/data/jobs/jobs-search';
import { jobFilter } from '../../../shared/interface/jobs';

@Component({
  selector: 'app-job-filter',
  imports: [NgbModule, NgbAccordionModule, FeatherIconComponent],
  templateUrl: './job-filter.component.html',
  styleUrl: './job-filter.component.scss'
})

export class JobFilterComponent {

  public sidebars: jobFilter[] = sidebars;
  public isOpen: boolean = false;

  openSidebar(){
    this.isOpen =! this.isOpen;
  }
  
}
