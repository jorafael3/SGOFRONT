import { Component, TemplateRef } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from '../../../../../shared/components/ui/card/card.component';
import { FeatherIconComponent } from '../../../../../shared/components/ui/feather-icon/feather-icon.component';

@Component({
  selector: 'app-initial-offcanvas',
  imports: [CardComponent, FeatherIconComponent],
  templateUrl: './initial-offcanvas.component.html',
  styleUrl: './initial-offcanvas.component.scss',
})
export class InitialOffcanvasComponent {
  constructor(private offcanvasService: NgbOffcanvas) {}

  open(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { panelClass: 'common-offcanvas' });
  }
}
