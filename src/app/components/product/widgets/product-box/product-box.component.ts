import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbModal, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';

import { ProductDetailsModalComponent } from '../../../../shared/components/ui/modal/product-details-modal/product-details-modal.component';
import { Product } from '../../../../shared/interface/product';

@Component({
  selector: 'app-product-box',
  imports: [CommonModule, RouterModule, NgbRatingModule],
  templateUrl: './product-box.component.html',
  styleUrl: './product-box.component.scss'
})

export class ProductBoxComponent {

  @Input() product: Product;

  constructor(private modal: NgbModal) {}

  openModal(product: Product) {
    const modalRef = this.modal.open(ProductDetailsModalComponent, { centered: true, size: 'lg', windowClass: 'product-modal' });
    modalRef.componentInstance.productDetail = product;
  }
  
}
