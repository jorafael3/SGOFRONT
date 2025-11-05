import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CardComponent } from '../../../../../shared/components/ui/card/card.component';
import { SvgIconComponent } from '../../../../../shared/components/ui/svg-icon/svg-icon.component';
import { squaresColor } from '../../../../../shared/data/dashboard/online-course';
import { Course } from '../../../../../shared/interface/dashboard/online-course';

@Component({
  selector: 'app-courses',
  imports: [RouterModule,CommonModule, CardComponent, SvgIconComponent],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss'
})

export class CoursesComponent {

  @Input() course: Course;

  public squaresColor = squaresColor;

}
