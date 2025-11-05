import { Component } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from "../../../../shared/components/ui/card/card.component";
import { SizeModalComponent } from '../widgets/size-modal/size-modal.component';

@Component({
  selector: 'app-sizes-modals',
  imports: [CardComponent],
  templateUrl: './sizes-modals.component.html',
  styleUrl: './sizes-modals.component.scss'
})

export class SizesModalsComponent {

  public modal: NgbModalRef;

  constructor(private modalService: NgbModal) {}
  
  openModal(value: string) {
    let title = '';

    if(value == 'fullScreen') {
      this.modal = this.modalService.open(SizeModalComponent, { fullscreen: true, modalDialogClass: 'modal-box' })
      title = 'Full Screen Modal'
    } else if(value == 'extraLarge') {
      this.modal = this.modalService.open(SizeModalComponent, { size: 'xl', modalDialogClass: 'modal-box' })
      title = 'Extra Large Modal'
    } else if(value == 'large') {
      this.modal = this.modalService.open(SizeModalComponent, { size: 'lg', modalDialogClass: 'modal-box' })
      title = 'Large Modal'
    } else if(value == 'small') {
      this.modal = this.modalService.open(SizeModalComponent, { size: 'sm', modalDialogClass: 'modal-box' })
      title = 'Small Modal'
    }

    this.modal.componentInstance.title = title
  }
}
