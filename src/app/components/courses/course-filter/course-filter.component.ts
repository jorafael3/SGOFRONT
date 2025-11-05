import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbAccordionModule, NgbRatingConfig, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';

import { FeatherIconComponent } from "../../../shared/components/ui/feather-icon/feather-icon.component";
import { courseSidebar } from '../../../shared/data/courses';

@Component({
  selector: 'app-course-filter',
  imports: [CommonModule, NgbAccordionModule, FeatherIconComponent,NgbRatingModule],
  templateUrl: './course-filter.component.html',
  styleUrl: './course-filter.component.scss'
})

export class CourseFilterComponent {

  public courseSidebar = courseSidebar;
  public isOpen: boolean = false;

  constructor(public config: NgbRatingConfig) {
    config.max = 5;
    config.readonly = true;
  }

  openFilter(){
    this.isOpen =! this.isOpen;
  }
}
