import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";

@Component({
  selector: 'app-reset-rating',
  imports: [CommonModule, ReactiveFormsModule, NgbRatingModule, CardComponent],
  templateUrl: './reset-rating.component.html',
  styleUrl: './reset-rating.component.scss'
})

export class ResetRatingComponent {

  public ctrl = new FormControl<number | null>(null, Validators.required);
	public readonly: boolean = false;

}
