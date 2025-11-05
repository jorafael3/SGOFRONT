import { Component } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from '../../../../../shared/components/ui/card/card.component';
import { ProjectFormComponent } from '../project-form/project-form.component';

@Component({
  selector: 'app-offcanvas-variation',
  imports: [CardComponent],
  templateUrl: './offcanvas-variation.component.html',
  styleUrl: './offcanvas-variation.component.scss'
})

export class OffcanvasVariationComponent {

  public title: string = '';
  
  constructor(private offcanvasService: NgbOffcanvas){}
    
  openScrolling() {
    const offcanvasRef = this.offcanvasService.open(ProjectFormComponent, { scroll: true, backdrop: false, keyboard: false, panelClass: 'common-offcanvas' });
    offcanvasRef.componentInstance.title = 'Offcanvas Body Scrolling';
  }

  openBackdropScrolling() {
    const offcanvasRef = this.offcanvasService.open(ProjectFormComponent, { scroll: true, panelClass: 'common-offcanvas' });
    offcanvasRef.componentInstance.title = 'Backdrop with Scrolling';
  }

  openStatic() {
    const offcanvasRef = this.offcanvasService.open(ProjectFormComponent, { backdrop: 'static', keyboard: false, panelClass: 'common-offcanvas' });
    offcanvasRef.componentInstance.title = 'Static Offcanvas';
  }
  
}
