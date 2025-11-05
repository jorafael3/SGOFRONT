import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";
import { cardToggleOptions3 } from '../../../../../shared/data/common';

@Component({
  selector: 'app-school-calendar',
  imports: [CommonModule, NgbDatepickerModule, FormsModule, CardComponent],
  templateUrl: './school-calendar.component.html',
  styleUrl: './school-calendar.component.scss'
})

export class SchoolCalendarComponent {

  public cardToggleOption = cardToggleOptions3;

  public model: NgbDateStruct | undefined;
  
  constructor() {
    const today = new Date();
    this.model = { 
      year: today.getFullYear(), 
      month: today.getMonth() + 1, 
      day: today.getDate() 
    };
  }
}
