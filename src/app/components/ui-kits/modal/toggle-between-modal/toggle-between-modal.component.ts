import { Component, TemplateRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from "../../../../shared/components/ui/card/card.component";

@Component({
  selector: 'app-toggle-between-modal',
  imports: [RouterModule, CardComponent],
  templateUrl: './toggle-between-modal.component.html',
  styleUrl: './toggle-between-modal.component.scss'
})

export class ToggleBetweenModalComponent {

  constructor(private modal: NgbModal){}
  
  openModal(value: TemplateRef<NgbModal>){
    this.closeModal()
    this.modal.open(value, { centered: true })
  }

  closeModal(){
    this.modal.dismissAll()
  }
  
}
