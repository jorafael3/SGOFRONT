import { Component, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-result-modal',
  imports: [],
  templateUrl: './result-modal.component.html',
  styleUrl: './result-modal.component.scss'
})

export class ResultModalComponent {

  constructor(private modal: NgbModal){}
    
  openModal(value: TemplateRef<NgbModal>){
    this.modal.open(value, { centered: true })
  }

  closeModal(){
    this.modal.dismissAll()
  }
}
