import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Select2Module } from 'ng-select2-component';
import { contactTypes } from '../../../../shared/data/contacts';
import { ContactService } from '../../../../shared/services/contact.service';

@Component({
  selector: 'app-add-contact-modal',
  imports: [CommonModule, ReactiveFormsModule, Select2Module],
  templateUrl: './add-contact-modal.component.html',
  styleUrl: './add-contact-modal.component.scss'
})

export class AddContactModalComponent {

  public contactTypes = contactTypes;

  public contactForm = new FormGroup({
    first_name: new FormControl('', [Validators.required]),
    last_name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    contact_number: new FormControl('', [Validators.required, 
                    Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"),
                    Validators.minLength(10),
                    Validators.maxLength(10)]),
    contactType: new FormControl('', [Validators.required]),
  })

  constructor(private modal: NgbActiveModal, private contactService: ContactService) { }

  saveContact() {
    this.contactForm.markAllAsTouched();

    if (this.contactForm.valid) {
      this.contactService.addContact(this.contactForm.value);
    }

    this.modal.close();
    this.contactForm.reset();
  }

  closeModal() {
    this.modal.close();
  }
}
