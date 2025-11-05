import { Component } from '@angular/core';
import { selectState } from '../../../../../../../shared/data/form-layout';
import { Select2Module } from 'ng-select2-component';

@Component({
  selector: 'app-feedback',
  imports: [Select2Module],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss'
})

export class FeedbackComponent {

  public selectState = selectState;

}
