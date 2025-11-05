import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { CardComponent } from "../../../../shared/components/ui/card/card.component";
import { menuItems } from '../../../../shared/data/menu';

@Component({
  selector: 'app-default-sitemap',
  imports: [CommonModule, CardComponent],
  templateUrl: './default-sitemap.component.html',
  styleUrl: './default-sitemap.component.scss'
})

export class DefaultSitemapComponent {

  public menuItem = menuItems;

}
