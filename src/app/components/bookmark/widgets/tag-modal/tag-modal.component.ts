import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tag-modal',
  imports: [],
  templateUrl: './tag-modal.component.html',
  styleUrl: './tag-modal.component.scss'
})

export class TagModalComponent {

  @ViewChild("tagModal", { static: false }) tagModal: TemplateRef<string>;
  
  public closeResult: string;
  public modalOpen: boolean = false;

  constructor(private modalService: NgbModal) {}
  
  async openModal() {
    this.modalOpen = true;
    this.modalService.open(this.tagModal, {
      ariaLabelledBy: 'bookmark-Modal',
      windowClass: 'theme-modal modal-lg'
    }).result.then((result) => {
      `Result ${result}`
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: ModalDismissReasons): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  closeModal() {
    if (this.modalOpen) {
      this.modalService.dismissAll();
    }
  }
  
  ngOnDestroy() {
    if (this.modalOpen) {
      this.modalService.dismissAll();
    }
  }
}
