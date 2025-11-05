import { Component, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { SvgIconComponent } from "../../../../../shared/components/ui/svg-icon/svg-icon.component";

@Component({
  selector: 'app-profile-modal',
  imports: [SvgIconComponent],
  templateUrl: './profile-modal.component.html',
  styleUrl: './profile-modal.component.scss'
})

export class ProfileModalComponent {

  constructor(private modal: NgbModal){}
  
  openModal(value: TemplateRef<NgbModal>){
    this.modal.open(value, { centered: true })
  }

  closeModal(){
    this.modal.dismissAll()
  }
  
}
