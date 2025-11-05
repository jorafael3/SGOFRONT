import { Component } from '@angular/core';
import { Select2Module } from 'ng-select2-component';

import { CardComponent } from "../../../shared/components/ui/card/card.component";
import { country } from '../../../shared/data/country';

@Component({
  selector: 'app-add-user',
  imports: [Select2Module, CardComponent],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss'
})

export class AddUserComponent {

  public country = country;
  
}
