import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { FeatherIconComponent } from '../../../../../shared/components/ui/feather-icon/feather-icon.component';

@Component({
  selector: 'app-simple-modal',
  imports: [FeatherIconComponent],
  templateUrl: './simple-modal.component.html',
  styleUrl: './simple-modal.component.scss'
})

export class SimpleModalComponent {

  constructor(private modal: NgbActiveModal) {}

  closeModal() {
    this.modal.close();
  }
  
}
