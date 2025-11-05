import { Component, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from "../../../../shared/components/ui/card/card.component";

@Component({
  selector: 'app-grid-modal',
  imports: [CardComponent],
  templateUrl: './grid-modal.component.html',
  styleUrl: './grid-modal.component.scss'
})

export class GridModalComponent {

  constructor(private modal: NgbModal){}
    
  openModal(value: TemplateRef<NgbModal>){
    this.modal.open(value, { centered: true,  modalDialogClass: 'modal-box' })
  }

  closeModal(){
    this.modal.dismissAll()
  }
  
}
