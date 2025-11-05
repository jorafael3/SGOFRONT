import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { TwoFactorAuthenticationModalComponent } from '../modal/two-factor-authentication-modal/two-factor-authentication-modal.component';

@Component({
  selector: 'app-two-factor-authentication',
  imports: [],
  templateUrl: './two-factor-authentication.component.html',
  styleUrl: './two-factor-authentication.component.scss'
})

export class TwoFactorAuthenticationComponent {

  constructor(private modal: NgbModal) {}

   openModal() {
      this.modal.open(TwoFactorAuthenticationModalComponent, { centered: true });
    }

}
