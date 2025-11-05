import { Component } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";

@Component({
  selector: 'app-javascript-behavior',
  imports: [NgbNavModule, CardComponent],
  templateUrl: './javascript-behavior.component.html',
  styleUrl: './javascript-behavior.component.scss'
})

export class JavascriptBehaviorComponent {

  public active = "home";

}
