import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Injectable } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of, OperatorFunction } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";

const WIKI_URL = 'https://en.wikipedia.org/w/api.php';
const PARAMS = new HttpParams({
  fromObject: {
    action: 'opensearch',
    format: 'json',
    origin: '*',
  },
});

@Injectable()

export class WikipediaService {

  constructor(private http: HttpClient) { }

  search(term: string) {
    if (term === '') {
      return of([]);
    }

    return this.http
      .get<[any, string[]]>(WIKI_URL, { params: PARAMS.set('search', term) })
      .pipe(map((response) => response[1]));
  }
}

@Component({
    selector: 'app-wikipedia-search',
    imports: [CommonModule, FormsModule, NgbModule, CardComponent],
    templateUrl: './wikipedia-search.component.html',
    styleUrl: './wikipedia-search.component.scss',
    providers: [WikipediaService]
})

export class WikipediaSearchComponent {

  public model: string;
  public searching = false;
  public searchFailed = false;

  constructor(private _service: WikipediaService) { }

  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => (this.searching = true)),
      switchMap((term) =>
        this._service.search(term).pipe(
          tap(() => (this.searchFailed = false)),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          }),
        ),
      ),
      tap(() => (this.searching = false)),
    );
    
}
