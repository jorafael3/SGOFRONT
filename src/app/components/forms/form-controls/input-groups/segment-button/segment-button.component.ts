import { Component } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from '../../../../../shared/components/ui/card/card.component';

@Component({
  selector: 'app-segment-button',
  imports: [CardComponent, NgbDropdownModule],
  templateUrl: './segment-button.component.html',
  styleUrl: './segment-button.component.scss',
})

export class SegmentButtonComponent {}
