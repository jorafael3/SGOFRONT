import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-label-modal',
  imports: [],
  templateUrl: './add-label-modal.component.html',
  styleUrl: './add-label-modal.component.scss'
})

export class AddLabelModalComponent {

  constructor(private modal: NgbActiveModal) {}

  closeModal() {
    this.modal.close();
  }
  
}
