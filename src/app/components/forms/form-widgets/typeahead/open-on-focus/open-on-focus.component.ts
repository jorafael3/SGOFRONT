import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { merge, Observable, OperatorFunction, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";
import { states } from '../../../../../shared/data/form-widgets';

@Component({
  selector: 'app-open-on-focus',
  imports: [CommonModule, FormsModule, NgbModule, CardComponent],
  templateUrl: './open-on-focus.component.html',
  styleUrl: './open-on-focus.component.scss'
})

export class OpenOnFocusComponent {

  @ViewChild('instance', { static: true }) instance: NgbTypeahead;

  public model: string;
  public states = states;
  public focus$ = new Subject<string>();
  public click$ = new Subject<string>();

  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map((term) =>
        (term === '' ? states : states.filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10),
      ),
    );
  };

}
