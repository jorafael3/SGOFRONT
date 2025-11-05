import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-scan-qr-code-modal',
  imports: [],
  templateUrl: './scan-qr-code-modal.component.html',
  styleUrl: './scan-qr-code-modal.component.scss'
})

export class ScanQrCodeModalComponent {

constructor(private activeModal: NgbActiveModal) { }

  closeModal() {
    this.activeModal.close();
  }

}
