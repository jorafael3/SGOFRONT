import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cuba-signup-modal',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cuba-signup-modal.component.html',
  styleUrl: './cuba-signup-modal.component.scss'
})

export class CubaSignupModalComponent {

  public signUpForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    policy: new FormControl(true, [Validators.required]),
  })

  constructor(private modal: NgbActiveModal) {}

  handleChange(event: any) {
    const value = event.target.checked;

    this.signUpForm.get('policy')?.setValue(value);
  }

  submit() {
    this.signUpForm.markAllAsTouched();

    if(this.signUpForm.valid) {
      this.modal.close()
    }
  }
  
}
