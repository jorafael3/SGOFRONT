import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbRatingConfig, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';

import { featuredTutorialDetails } from '../../../../shared/data/knowledge-base';

@Component({
  selector: 'app-common-featured-tutorials',
  imports: [CommonModule, NgbRatingModule],
  templateUrl: './common-featured-tutorials.component.html',
  styleUrl: './common-featured-tutorials.component.scss'
})

export class CommonFeaturedTutorialsComponent {

  @Input() details = featuredTutorialDetails;
  @Input() headerTitle: string = '';

  constructor(public config: NgbRatingConfig) {
    config.max = 5;
    config.readonly = true;
  }

}
