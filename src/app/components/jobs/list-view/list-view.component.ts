import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbRatingConfig, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';

import { CommonCardComponent } from "../common-card/common-card.component";
import { JobFilterComponent } from "../job-filter/job-filter.component";
import { jobCards } from '../../../shared/data/jobs/jobs-search';

@Component({
  selector: 'app-list-view',
  imports: [CommonModule, NgbRatingModule, JobFilterComponent, CommonCardComponent],
  templateUrl: './list-view.component.html',
  styleUrl: './list-view.component.scss'
})

export class ListViewComponent {

  public jobCards = jobCards;

  constructor(public config: NgbRatingConfig) {
    config.max = 5;
    config.readonly = true;
  }

}
