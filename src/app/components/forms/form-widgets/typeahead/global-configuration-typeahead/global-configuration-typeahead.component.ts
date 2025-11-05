import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule, NgbTypeaheadConfig } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { CardComponent } from "../../../../../shared/components/ui/card/card.component";
import { states } from '../../../../../shared/data/form-widgets';

@Component({
    selector: 'app-global-configuration-typeahead',
    imports: [CommonModule, FormsModule, NgbModule, CardComponent],
    templateUrl: './global-configuration-typeahead.component.html',
    styleUrl: './global-configuration-typeahead.component.scss'
})

export class GlobalConfigurationTypeaheadComponent {

  public model: string;
  public states = states;

  constructor(config: NgbTypeaheadConfig) {
    config.showHint = true;
  }
  
  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) =>
        term.length < 2 ? [] : states.filter((v) => v.toLowerCase().startsWith(term.toLocaleLowerCase())).splice(0, 10),
      ),
    )
}
