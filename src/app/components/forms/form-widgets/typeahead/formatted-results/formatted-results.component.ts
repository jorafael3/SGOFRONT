import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";
import { states } from '../../../../../shared/data/form-widgets';

@Component({
    selector: 'app-formatted-results',
    imports: [CommonModule, FormsModule, NgbModule, CardComponent],
    templateUrl: './formatted-results.component.html',
    styleUrl: './formatted-results.component.scss'
})

export class FormattedResultsComponent {

  public model: string
  public states = states;

  formatter = (result: string) => result.toUpperCase();

  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) =>
        term === '' ? [] : states.filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10),
      ),
    );

}
