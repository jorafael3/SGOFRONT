import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-manage-api-modal',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './manage-api-modal.component.html',
  styleUrl: './manage-api-modal.component.scss'
})

export class ManageApiModalComponent {

  public validationForm = new FormGroup({
    api_name: new FormControl('', Validators.required),
    api_key: new FormControl('', Validators.required),

  })

  constructor(private modal: NgbActiveModal) { }

  submitForm() {
    this.validationForm.markAllAsTouched();
    if (this.validationForm.valid) {
      this.closeModal()
    }
  }

  closeModal() {
    this.modal.close();
  }
  
}
