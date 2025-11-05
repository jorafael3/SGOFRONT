import { Component } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from "../../../../shared/components/ui/card/card.component";
import { SizeModalComponent } from '../widgets/size-modal/size-modal.component';

@Component({
  selector: 'app-full-screen-modals',
  imports: [CardComponent],
  templateUrl: './full-screen-modals.component.html',
  styleUrl: './full-screen-modals.component.scss'
})

export class FullScreenModalsComponent {

  public modal: NgbModalRef;
  
  constructor(private modalService: NgbModal) {}
  
  openModal(value: string) {
    let title = '';

    if(value == 'fullScreen') {
      this.modal = this.modalService.open(SizeModalComponent, { fullscreen: true, scrollable: true, modalDialogClass: 'modal-box' })
      title = 'Full Screen Modal'
    } else if(value == 'below-sm') {
      this.modal = this.modalService.open(SizeModalComponent, { modalDialogClass: 'modal-fullscreen-sm-down modal-box', })
      title = 'Fullscreen Below sm'
    } else if(value == 'below-md') {
      this.modal = this.modalService.open(SizeModalComponent, { modalDialogClass: 'modal-fullscreen-md-down modal-box' })
      title = 'Fullscreen Below md'
    } else if(value == 'below-lg') {
      this.modal = this.modalService.open(SizeModalComponent, { modalDialogClass: 'modal-fullscreen-lg-down modal-box' })
      title = 'Fullscreen Below lg'
    } else if(value == 'below-xl') {
      this.modal = this.modalService.open(SizeModalComponent, { modalDialogClass: 'modal-fullscreen-xl-down modal-box' })
      title = 'Fullscreen Below xl'
    } else if(value == 'below-xxl') {
      this.modal = this.modalService.open(SizeModalComponent, { modalDialogClass: 'modal-fullscreen-xxl-down modal-box' })
      title = 'Fullscreen Below xxl'
    }

    this.modal.componentInstance.title = title;
    this.modal.componentInstance.buttons = true;
  }
  
}
