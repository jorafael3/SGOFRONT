import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal, NgbRatingConfig, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-review-modal',
  imports: [CommonModule, NgbRatingModule, ReactiveFormsModule],
  templateUrl: './review-modal.component.html',
  styleUrl: './review-modal.component.scss'
})

export class ReviewModalComponent {

  public rating = 4;
  public reviewForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    rating: new FormControl(this.rating ? this.rating : 0)
  })

  constructor(private config: NgbRatingConfig, private modal: NgbActiveModal) {
    this.config.max = 5;
    this.config.readonly = false;
  }

  submit() {
    this.reviewForm.markAllAsTouched();

    if(this.reviewForm.valid) {
      this.modal.close();
    }
  }

  closeModal() {
    this.modal.close();
  }
  
}
