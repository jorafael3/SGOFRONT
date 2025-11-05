import { Component, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Select2Module } from 'ng-select2-component';

import { CardComponent } from '../../../shared/components/ui/card/card.component';

import { modalInValues, modalOutValues } from '../../../shared/data/bonus-ui/animated-modal';

@Component({
  selector: 'app-animated-modal',
  imports: [FormsModule, Select2Module, CardComponent],
  templateUrl: './animated-modal.component.html',
  styleUrl: './animated-modal.component.scss',
})
export class AnimatedModalComponent {
  
  public modalInValues = modalInValues;
  public modalOutValues = modalOutValues;
  public modalInSelectedValue = 'bounceIn';
  public modalOutSelectedValue = 'flipOutX';
  public toastVisible: boolean = false;

  private modalRef: NgbModalRef | null = null;

  constructor(private modal: NgbModal) {}

  openModal(value: TemplateRef<string>) {
    this.modalRef = this.modal.open(value, {
      modalDialogClass: 'animated ' + this.modalInSelectedValue,
      windowClass: 'modal-popup animated-popup',
    });
  }

  closeModal() {
    if (this.modalRef) {
      const modalDialog = document.querySelector('.modal-dialog');
      if (modalDialog) {
        modalDialog.classList.remove(this.modalInSelectedValue);
        modalDialog.classList.add(this.modalOutSelectedValue);

        this.modalRef?.close();
      }
    }

    this.toastVisible = true;
    setTimeout(() => {
      this.toastVisible = false;
    }, 5000);
  }
}
