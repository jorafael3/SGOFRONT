import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from "../../../../shared/components/ui/card/card.component";
import { flatButton } from '../../../../shared/data/buttons';

@Component({
  selector: 'app-defaults-buttons',
  imports: [CardComponent,CommonModule,NgbTooltipModule],
  templateUrl: './defaults-buttons.component.html',
  styleUrl: './defaults-buttons.component.scss'
})

export class DefaultsButtonsComponent {

    public defaultButton = flatButton;

}
