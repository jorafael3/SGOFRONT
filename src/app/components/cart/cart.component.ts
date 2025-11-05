import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from "../../shared/components/ui/card/card.component";
import { SvgIconComponent } from "../../shared/components/ui/svg-icon/svg-icon.component";
import { CartSidebarComponent } from "./cart-sidebar/cart-sidebar.component";

import { OrderDetailsProduct } from '../../shared/interface/order';
import { CartService } from '../../shared/services/cart.service';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, NgbTooltipModule, RouterModule, CardComponent, SvgIconComponent, CartSidebarComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})

export class CartComponent {

  public selected: number[] = [];

  constructor(public cartService: CartService) {}

  checkUncheckAll(event: Event) {
    this.cartService.cartItems.forEach((item: OrderDetailsProduct) => {
      item.is_checked = (<HTMLInputElement>event?.target)?.checked;
      this.setSelectedItem((<HTMLInputElement>event?.target)?.checked, item?.id);
    });
  }

  onItemChecked(event: Event) {
    this.setSelectedItem((<HTMLInputElement>event.target)?.checked, Number((<HTMLInputElement>event.target)?.value));
  }

  setSelectedItem(checked: Boolean, value: Number) {
    const index = this.selected.indexOf(Number(value));
    if (checked) {
      if (index == -1) this.selected.push(Number(value));
    } else {
      this.selected = this.selected.filter(id => id !== Number(value));
    }
  }
}
