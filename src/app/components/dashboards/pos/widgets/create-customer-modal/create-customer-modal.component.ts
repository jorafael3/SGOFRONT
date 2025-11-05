import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-customer-modal',
  imports: [],
  templateUrl: './create-customer-modal.component.html',
  styleUrl: './create-customer-modal.component.scss'
})

export class CreateCustomerModalComponent {

  constructor(private modal: NgbActiveModal) {}

  closeModal() {
    this.modal.close();
  }
}
