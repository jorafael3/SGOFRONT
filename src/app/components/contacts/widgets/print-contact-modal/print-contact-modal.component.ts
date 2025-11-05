import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxPrintModule } from 'ngx-print';

import { Contact } from '../../../../shared/interface/contacts';

@Component({
  selector: 'app-print-contact-modal',
  imports: [NgxPrintModule],
  templateUrl: './print-contact-modal.component.html',
  styleUrl: './print-contact-modal.component.scss'
})

export class PrintContactModalComponent {

  @Input() activeContact: Contact;

  constructor(private modal: NgbActiveModal) {}

  closeModal() {
    this.modal.close();
  }
}
