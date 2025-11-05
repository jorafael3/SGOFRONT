import { Component } from '@angular/core';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Select2Data, Select2Module } from 'ng-select2-component';

import { category, categoryStatus } from '../../../../data/category';
import { Category } from '../../../../interface/category';

@Component({
  selector: 'app-create-category-modal',
  imports: [AngularEditorModule, Select2Module],
  templateUrl: './create-category-modal.component.html',
  styleUrl: './create-category-modal.component.scss'
})

export class CreateCategoryModalComponent {

  public category: Category[] = category;
  public categoryStatus = categoryStatus;
  public parentCategory: Select2Data = [];
  public categoryType: Select2Data = [];

  constructor(private modal: NgbActiveModal) {
    this.category.filter((category) => {
      this.parentCategory.push({ value: category.category_name, label: category.category_name });
      this.categoryType.push({ value: category.category_type, label: category.category_type });
    })
  }

  close() {
    this.modal.close();
  }
  
}
