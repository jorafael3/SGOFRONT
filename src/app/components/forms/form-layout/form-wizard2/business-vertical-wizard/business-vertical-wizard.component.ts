import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from "../../../../../shared/components/ui/card/card.component";
import { BusinessSettingComponent } from "./widgets/business-setting/business-setting.component";
import { ChooseAccountComponent } from "./widgets/choose-account/choose-account.component";
import { CompletedComponent } from './widgets/completed/completed.component';
import { ContactDetailsComponent } from "./widgets/contact-details/contact-details.component";
import { PayDetailsComponent } from "./widgets/pay-details/pay-details.component";

import { businessVerticalWizard } from '../../../../../shared/data/form-widgets';

@Component({
  selector: 'app-business-vertical-wizard',
  imports: [CommonModule, NgbNavModule, FormsModule,
            ChooseAccountComponent, BusinessSettingComponent, ContactDetailsComponent,
            PayDetailsComponent, CompletedComponent, CardComponent],
  templateUrl: './business-vertical-wizard.component.html',
  styleUrl: './business-vertical-wizard.component.scss'
})

export class BusinessVerticalWizardComponent {

  @Input() type: string = '';
  @Input() title: string = 'Business Vertical Wizard';

  public businessVerticalWizard = businessVerticalWizard;
  public active = 1;

  changeTab(value: number) {
    this.active = value;
  }

}
