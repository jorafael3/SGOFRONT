import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbModal, NgbNavModule, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';

import { ReviewModalComponent } from '../../../../shared/components/ui/modal/review-modal/review-modal.component';
import { TableComponent } from "../../../../shared/components/ui/table/table.component";
import { productDetails } from '../../../../shared/data/product';
import { TableConfigs } from '../../../../shared/interface/common';

@Component({
  selector: 'app-product-details-tab',
  imports: [CommonModule, NgbNavModule, NgbRatingModule, TableComponent],
  templateUrl: './product-details-tab.component.html',
  styleUrl: './product-details-tab.component.scss'
})

export class ProductDetailsTabComponent {

  public active = 1;
  public productDetails = productDetails;
  public rating: number[] = Array.from({length: 5}, (_, i) => i + 1);

  public tableConfig: TableConfigs = {
    columns: [
      { title: 'Material', field_value: 'material' },
      { title: 'Colors', field_value: 'colors' },
      { title: 'Size Range', field_value: 'size_range' },
      { title: 'Fit', field_value: 'fit' },
      { title: 'NeckLine', field_value: 'neckline' },
      { title: 'Seam', field_value: 'seam' }
    ],
    data: productDetails.additional_info
  };

  constructor(private modal: NgbModal) {}

  openReviewModal() {
    this.modal.open(ReviewModalComponent, { centered: true, size: 'lg', windowClass: 'category-popup custom-input customer-review-modal' })
  }
}
