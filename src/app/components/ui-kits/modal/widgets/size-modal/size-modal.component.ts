import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { FeatherIconComponent } from '../../../../../shared/components/ui/feather-icon/feather-icon.component';

@Component({
  selector: 'app-size-modal',
  imports: [FeatherIconComponent],
  templateUrl: './size-modal.component.html',
  styleUrl: './size-modal.component.scss'
})

export class SizeModalComponent {

  @Input() title: string;
  @Input() buttons: boolean = false;
  
  constructor(private modal: NgbActiveModal) {}

  closeModal() {
    this.modal.close();
  }
  
}
