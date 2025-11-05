import { Component, Input } from '@angular/core';
import { NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-form',
  imports: [],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})

export class UserFormComponent {

  @Input() title: string;
  
  constructor(private offcanvasService: NgbActiveOffcanvas) {}

  closeOffcanvas() {
    this.offcanvasService.close();
  }

}
