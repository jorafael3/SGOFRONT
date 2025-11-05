import { Component, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from "../../../../shared/components/ui/card/card.component";

@Component({
  selector: 'app-centered-modal',
  imports: [CardComponent],
  templateUrl: './centered-modal.component.html',
  styleUrl: './centered-modal.component.scss'
})

export class CenteredModalComponent {

  constructor(private modal: NgbModal){}

  openModal(value: TemplateRef<NgbModal>){
    this.modal.open(value, { centered: true })
  }

  closeModal(){
    this.modal.dismissAll()
  }
  
}
