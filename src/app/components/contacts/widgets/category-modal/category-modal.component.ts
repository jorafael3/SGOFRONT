import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-category-modal',
  imports: [],
  templateUrl: './category-modal.component.html',
  styleUrl: './category-modal.component.scss'
})

export class CategoryModalComponent {

  constructor(private modal: NgbActiveModal) {}

  closeModal() {
    this.modal.close();
  }
}
