import { Component } from '@angular/core';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-compose-email-modal',
  imports: [AngularEditorModule],
  templateUrl: './compose-email-modal.component.html',
  styleUrl: './compose-email-modal.component.scss'
})

export class ComposeEmailModalComponent {

  public fields = {
    cc: false,
    bcc: false,
  };

  constructor(private modal: NgbActiveModal) {}

  handleFields(value: string) {
    this.fields[value as 'cc' | 'bcc'] = !this.fields[value as 'cc' | 'bcc'];
  }

  closeModal() {
    this.modal.close();
  }
}
