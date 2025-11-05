import { Component } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from '../../../../../shared/components/ui/card/card.component';
import { UserFormComponent } from '../user-form/user-form.component';
import { ProjectFormComponent } from '../project-form/project-form.component';

@Component({
  selector: 'app-offcanvas-direction',
  imports: [CardComponent],
  templateUrl: './offcanvas-direction.component.html',
  styleUrl: './offcanvas-direction.component.scss'
})

export class OffcanvasDirectionComponent {

  public title: string = '';

  constructor(private offcanvasService: NgbOffcanvas){}
    
  openTop() {
    const offcanvasRef = this.offcanvasService.open(UserFormComponent, { position: 'top', panelClass: 'common-offcanvas' });
    offcanvasRef.componentInstance.title = 'Offcanvas Top';
  }

  openRight() {
    const offcanvasRef = this.offcanvasService.open(ProjectFormComponent, { position: 'end', panelClass: 'common-offcanvas' });
    offcanvasRef.componentInstance.title = 'Offcanvas Right';
  }

  openBottom() {
    const offcanvasRef = this.offcanvasService.open(UserFormComponent, { position: 'bottom', panelClass: 'common-offcanvas' });
    offcanvasRef.componentInstance.title = 'Offcanvas Bottom';
  }

  openLeft() {
    const offcanvasRef = this.offcanvasService.open(ProjectFormComponent, { position: 'start', panelClass: 'common-offcanvas' });
    offcanvasRef.componentInstance.title = 'Offcanvas Left';
  }
  
}
