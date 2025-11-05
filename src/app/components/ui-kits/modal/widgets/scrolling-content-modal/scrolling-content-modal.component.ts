import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { FeatherIconComponent } from '../../../../../shared/components/ui/feather-icon/feather-icon.component';
import { modalContent } from '../../../../../shared/data/ui-kits/modal';

@Component({
  selector: 'app-scrolling-content-modal',
  imports: [CommonModule, FeatherIconComponent],
  templateUrl: './scrolling-content-modal.component.html',
  styleUrl: './scrolling-content-modal.component.scss'
})

export class ScrollingContentModalComponent {

  public modalContent = modalContent;
  
  constructor(private modal: NgbActiveModal) {}

  closeModal() {
    this.modal.close();
  }
  
}
