import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbRatingConfig, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';

import { CommonCardComponent } from "../../common-card/common-card.component";
import { jobCards } from '../../../../shared/data/jobs/jobs-search';

@Component({
  selector: 'app-similar-jobs',
  imports: [CommonModule, NgbRatingModule, CommonCardComponent],
  templateUrl: './similar-jobs.component.html',
  styleUrl: './similar-jobs.component.scss'
})

export class SimilarJobsComponent {

  public jobCardsDetails = jobCards;
  
  constructor(public config: NgbRatingConfig) {
    config.max = 5;
    config.readonly = true;
  }

}
