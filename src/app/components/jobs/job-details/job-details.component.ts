import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbRatingConfig, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';

import { JobFilterComponent } from "../job-filter/job-filter.component";
import { SimilarJobsComponent } from "./similar-jobs/similar-jobs.component";
import { jobDetail } from '../../../shared/data/jobs/jobs-search';

@Component({
  selector: 'app-job-details',
  imports: [CommonModule, RouterModule, NgbRatingModule, JobFilterComponent, SimilarJobsComponent],
  templateUrl: './job-details.component.html',
  styleUrl: './job-details.component.scss'
})

export class JobDetailsComponent {

  public jobDetail = jobDetail;

  constructor(public config: NgbRatingConfig) {
    config.max = 5;
    config.readonly = true;
  }

}
