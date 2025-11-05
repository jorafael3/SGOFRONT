import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDateStruct, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Select2Module } from 'ng-select2-component';

import { CardComponent } from "../../../../shared/components/ui/card/card.component";
import { FeatherIconComponent } from '../../../../shared/components/ui/feather-icon/feather-icon.component';
import { datepicker } from '../../../../shared/data/form-widgets';

@Component({
  selector: 'app-datepicker',
  imports: [CommonModule, NgbModule, FormsModule, FeatherIconComponent, Select2Module, CardComponent],
  templateUrl: './datepicker.component.html',
  styleUrl: './datepicker.component.scss'
})

export class DatepickerComponent {

  public Details = datepicker;
  public model: NgbDateStruct;
  public date: { year: number, month: number };
  public displayMonths = 2;
  public navigation = 'select';
  public showWeekNumbers = false;
  public outsideDays = 'visible';
  public hoveredDate: NgbDate | null = null;
  public fromDate: NgbDate | null;
  public toDate: NgbDate | null;
  public model2: NgbDateStruct;
  public placement = 'top';

  constructor(private calendar: NgbCalendar, public formatter: NgbDateParserFormatter) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }
  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) &&
      date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) { return this.toDate && date.after(this.fromDate) && date.before(this.toDate); }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) ||
      this.isHovered(date);
  }
  
  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

}
