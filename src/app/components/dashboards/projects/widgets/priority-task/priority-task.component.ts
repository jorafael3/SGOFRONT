import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CarouselModule, OwlOptions, SlidesOutputData } from 'ngx-owl-carousel-o';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";
import { priorityTask } from '../../../../../shared/data/dashboard/projects';
import { cardToggleOptions1 } from '../../../../../shared/data/common';

@Component({
  selector: 'app-priority-task',
  imports: [CommonModule, CarouselModule, NgbTooltipModule, CardComponent],
  templateUrl: './priority-task.component.html',
  styleUrl: './priority-task.component.scss'
})

export class PriorityTaskComponent {

  @ViewChild('carousel') carousel: any;

  public priorityTask = priorityTask;
  public cardToggleOption = cardToggleOptions1;
  public activeSlide: string = '';

  public options: OwlOptions = {
    loop: false,
    mouseDrag: false,
    autoplay: false,
    dots: false,
    nav: true,
    navSpeed: 1000,
    margin: 20,
    navText: [' <div class="prev"><i class="fa-solid fa-arrow-right-long fa-flip-horizontal"></i></div>', '  <div class="next"><i class="fa-solid fa-arrow-right-long"></i></div>'],
    responsive: {
      0: {
        items: 1
      },
      606: {
        items: 2
      },
      906: {
        items: 3
      },
    }
  }
  
  onCarouselLoad() {
    this.activeSlide = this.priorityTask[0].id.toString();
  }

  onSlideChange(event: SlidesOutputData) {
    if (this.carousel && event && event.slides && event.slides.length > 0) {
      const firstVisibleSlideIndex = event.startPosition;
      if (firstVisibleSlideIndex !== undefined && firstVisibleSlideIndex < this.priorityTask.length) {
        this.activeSlide = this.priorityTask[firstVisibleSlideIndex].id.toString();
      }
    }
  }

}
