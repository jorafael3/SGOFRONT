import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";
import { state } from '../../../../../shared/data/form-widgets';
import { State } from '../../../../../shared/interface/form-widgets';

@Component({
    selector: 'app-prevent-manual-entry',
    imports: [CommonModule, FormsModule, NgbModule, CardComponent],
    templateUrl: './prevent-manual-entry.component.html',
    styleUrl: './prevent-manual-entry.component.scss'
})

export class PreventManualEntryComponent {

  public model: State;
  public state = state;

  formatter = (state: State) => state.name;

  search: OperatorFunction<string, readonly { id: number; 'name': string }[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      filter((term) => term.length >= 2),
      map((term) => state.filter((state) => new RegExp(term, 'mi').test(state.name)).slice(0, 10)),
    );

}
