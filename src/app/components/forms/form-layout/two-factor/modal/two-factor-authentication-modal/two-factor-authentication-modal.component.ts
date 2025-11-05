import { Component } from '@angular/core';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ScanQrCodeModalComponent } from '../scan-qr-code-modal/scan-qr-code-modal.component';

@Component({
  selector: 'app-two-factor-authentication-modal',
  imports: [],
  templateUrl: './two-factor-authentication-modal.component.html',
  styleUrl: './two-factor-authentication-modal.component.scss'
})

export class TwoFactorAuthenticationModalComponent {

   constructor(private activeModal: NgbActiveModal, private modal: NgbModal) { }
   
   closeModal() {
    this.activeModal.close();
  }

  next(){
    this.modal.open(ScanQrCodeModalComponent, { centered: true, });
  }
  
}
