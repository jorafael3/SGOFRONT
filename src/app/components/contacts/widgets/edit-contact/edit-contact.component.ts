import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { Select2Module } from 'ng-select2-component';

import { contactTypes, urlTypes } from '../../../../shared/data/contacts';
import { Contact } from '../../../../shared/interface/contacts';

@Component({
  selector: 'app-edit-contact',
  imports: [CommonModule, NgbDatepickerModule, ReactiveFormsModule, 
            FormsModule, Select2Module],
  templateUrl: './edit-contact.component.html',
  styleUrl: './edit-contact.component.scss'
})
export class EditContactComponent {

  @Input() activeContact: Contact;
  @Output() edit = new EventEmitter();

  public selectedDate: { year: number; month: number; day: number };
  public contactTypes = contactTypes;
  public urlTypes = urlTypes;
  
  public moreInformation: boolean = false;

  ngOnInit() {
    this.setDate();
  }

  ngOnChanges(change: SimpleChanges) {
    if(change['activeContact']) {
      this.setDate()
    }
  }

  save() {
    this.moreInformation = false;
    this.edit.emit(false);
  }

  setDate() {
    if(this.activeContact && this.activeContact.DOB) {
      const date = new Date(this.activeContact.DOB);
      this.selectedDate = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
      };
    }
  }

  editMoreInformation() {
    this.moreInformation = true;
  }
}
