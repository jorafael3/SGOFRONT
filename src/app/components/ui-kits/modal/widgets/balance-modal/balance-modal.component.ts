import { Component, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { BalanceComponent } from "../../../../dashboards/crypto/widgets/balance/balance.component";

@Component({
  selector: 'app-balance-modal',
  imports: [BalanceComponent],
  templateUrl: './balance-modal.component.html',
  styleUrl: './balance-modal.component.scss'
})

export class BalanceModalComponent {

  constructor(private modal: NgbModal){}
    
  openModal(value: TemplateRef<NgbModal>){
    this.modal.open(value, { centered: true })
  }

  closeModal(){
    this.modal.dismissAll()
  }
}
