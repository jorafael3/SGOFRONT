import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { CardComponent } from "../../../../../shared/components/ui/card/card.component";

@Component({
  selector: 'app-calendar',
  imports: [NgbDatepickerModule, FormsModule, CardComponent],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})

export class CalendarComponent {

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
