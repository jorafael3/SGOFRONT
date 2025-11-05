import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Product } from '../../../../interface/product';

@Component({
  selector: 'app-product-details-modal',
  imports: [RouterModule],
  templateUrl: './product-details-modal.component.html',
  styleUrl: './product-details-modal.component.scss'
})

export class ProductDetailsModalComponent {

  @Input() productDetail: Product;

  public counter : number = 1;

  constructor(private modal: NgbActiveModal) {}

  changeValue(value: number) {
    if(value == -1){
      if(this.counter > 1){
        this.counter -= 1;
      }
    }else if(value == 1){
      this.counter += 1;
    }
  }

  closeModal() {
    this.modal.close();
  }
  
}
