import { Component, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from "../../../../shared/components/ui/card/card.component";

@Component({
  selector: 'app-static-backdrop-modal',
  imports: [CardComponent],
  templateUrl: './static-backdrop-modal.component.html',
  styleUrl: './static-backdrop-modal.component.scss'
})

export class StaticBackdropModalComponent {

  constructor(private modal: NgbModal,){}
  
  openModal(value: TemplateRef<NgbModal>){
    this.modal.open(value, { backdrop: 'static' })
  }

  closeModal(){
    this.modal.dismissAll()
  }
  
}
