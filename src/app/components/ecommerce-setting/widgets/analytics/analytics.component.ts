import { Component } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-analytics',
  imports: [NgbNavModule],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss'
})

export class AnalyticsComponent {

  public active = 'facebook-pixel';

}
