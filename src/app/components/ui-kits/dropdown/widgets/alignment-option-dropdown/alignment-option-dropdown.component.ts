import { Component, HostListener } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";

@Component({
  selector: 'app-alignment-option-dropdown',
  imports: [NgbDropdownModule, CardComponent],
  templateUrl: './alignment-option-dropdown.component.html',
  styleUrl: './alignment-option-dropdown.component.scss'
})

export class AlignmentOptionDropdownComponent {

  public dropdownPlacementOne: string = 'bottom-right';
  public dropdownPlacementTwo: string = 'bottom-right';

  constructor() {
    this.getPosition();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.getPosition();
  }

  getPosition() {
    this.dropdownPlacementOne = window.innerWidth > 1200 ? 'bottom-right' : 'bottom-left';
    this.dropdownPlacementTwo = window.innerWidth > 1200 ? 'bottom-left' : 'bottom-right';
  }
}
