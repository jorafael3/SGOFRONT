import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";

@Component({
  selector: 'app-total-earnings',
  imports: [CommonModule, RouterModule, CardComponent],
  templateUrl: './total-earnings.component.html',
  styleUrl: './total-earnings.component.scss'
})

export class TotalEarningsComponent {

}
