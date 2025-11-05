import { Component } from '@angular/core';
import { NgbActiveModal, NgbPopoverModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tooltip-popover-modal',
  imports: [NgbPopoverModule, NgbTooltipModule],
  templateUrl: './tooltip-popover-modal.component.html',
  styleUrl: './tooltip-popover-modal.component.scss'
})

export class TooltipPopoverModalComponent {

  constructor(private modal: NgbActiveModal) {}

  closeModal() {
    this.modal.close();
  }
  
}
