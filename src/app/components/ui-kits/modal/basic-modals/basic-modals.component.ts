import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from "../../../../shared/components/ui/card/card.component";
import { SimpleModalComponent } from '../widgets/simple-modal/simple-modal.component';
import { ScrollingContentModalComponent } from '../widgets/scrolling-content-modal/scrolling-content-modal.component';
import { TooltipPopoverModalComponent } from '../widgets/tooltip-popover-modal/tooltip-popover-modal.component';
import { CubaSignupModalComponent } from '../widgets/cuba-signup-modal/cuba-signup-modal.component';

@Component({
  selector: 'app-basic-modals',
  imports: [CardComponent],
  templateUrl: './basic-modals.component.html',
  styleUrl: './basic-modals.component.scss'
})

export class BasicModalsComponent {

  constructor(private modal: NgbModal) {}

  openSimpleModal() {
    this.modal.open(SimpleModalComponent,)
  }

  openScrollingModal() {
    this.modal.open(ScrollingContentModalComponent, { modalDialogClass: 'modal-box'} )
  }

  openTooltipPopoverModal() {
    this.modal.open(TooltipPopoverModalComponent, { centered: true, modalDialogClass: 'modal-box' } )
  }

  openCubaModal() {
    this.modal.open(CubaSignupModalComponent, { modalDialogClass: 'modal-box'} )
  }
  
}
