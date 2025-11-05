import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";
import { colorsTwo } from '../../../../../shared/data/ui-kits/helper-classes';

@Component({
  selector: 'app-link-dark-theme',
  imports: [CommonModule, NgbAlertModule, CardComponent],
  templateUrl: './link-dark-theme.component.html',
  styleUrl: './link-dark-theme.component.scss'
})

export class LinkDarkThemeComponent {

  public colors = colorsTwo;

}
