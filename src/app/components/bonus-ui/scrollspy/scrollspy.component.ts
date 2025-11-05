import { Component } from '@angular/core';

import { NavbarScrollspyComponent } from "./widgets/navbar-scrollspy/navbar-scrollspy.component";
import { NestedScrollspyComponent } from "./widgets/nested-scrollspy/nested-scrollspy.component";
import { ListGroupScrollspyComponent } from "./widgets/list-group-scrollspy/list-group-scrollspy.component";
import { CustomScrollspyComponent } from "./widgets/custom-scrollspy/custom-scrollspy.component";

@Component({
  selector: 'app-scrollspy',
  imports: [NavbarScrollspyComponent, NestedScrollspyComponent, ListGroupScrollspyComponent, 
            CustomScrollspyComponent],
  templateUrl: './scrollspy.component.html',
  styleUrl: './scrollspy.component.scss'
})

export class ScrollspyComponent {

}
