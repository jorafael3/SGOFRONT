import { CommonModule } from '@angular/common';
import { Component, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from "../../../../shared/components/ui/card/card.component";
import { FeatherIconComponent } from '../../../../shared/components/ui/feather-icon/feather-icon.component';
import { modalContent } from '../../../../shared/data/ui-kits/modal';

@Component({
  selector: 'app-scrolling-long-content-modal',
  imports: [CommonModule, CardComponent, FeatherIconComponent],
  templateUrl: './scrolling-long-content-modal.component.html',
  styleUrl: './scrolling-long-content-modal.component.scss'
})

export class ScrollingLongContentModalComponent {

  public modalContent = modalContent;

  constructor(private modal: NgbModal){}
      
  openModal(value: TemplateRef<NgbModal>){
    this.modal.open(value, { centered: true, scrollable: true,  modalDialogClass: 'modal-box' })
  }

  closeModal(){
    this.modal.dismissAll()
  }
  
}
