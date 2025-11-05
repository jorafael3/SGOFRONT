import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbRatingConfig, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';

import { JobCard } from '../../../shared/interface/jobs';

@Component({
  selector: 'app-common-card',
  imports: [CommonModule, NgbRatingModule],
  templateUrl: './common-card.component.html',
  styleUrl: './common-card.component.scss'
})

export class CommonCardComponent {

  @Input() jobCard: JobCard;

  constructor(public config: NgbRatingConfig) {
    config.max = 5;
    config.readonly = true;
  }
  
}
