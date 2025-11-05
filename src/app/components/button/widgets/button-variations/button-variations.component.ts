import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { CardComponent } from "../../../../shared/components/ui/card/card.component";
import { horizontalVariationCheckbox, verticalVariationColor, verticalVariationRadio } from '../../../../shared/data/buttons';

@Component({
  selector: 'app-button-variations',
  imports: [CommonModule, CardComponent],
  templateUrl: './button-variations.component.html',
  styleUrl: './button-variations.component.scss'
})

export class ButtonVariationsComponent {

  public verticalVariationColor = verticalVariationColor;
  public verticalVariationRadio = verticalVariationRadio;
  public horizontalVariationCheckbox = horizontalVariationCheckbox;

  public open: boolean = false;
  public open2: boolean = false;
  public open3: boolean = false;
  public open4: boolean = false;
  public open5: boolean = false;
  
  openMenu(){
    this.open = !this.open
  }
  openMenu2(){
    this.open2 = !this.open2
  }
  openMenu3(){
    this.open3 = !this.open3
  }
  openMenu4(){
    this.open4 = !this.open4
  }
  openMenu5(){
    this.open5 = !this.open5
  }

}
