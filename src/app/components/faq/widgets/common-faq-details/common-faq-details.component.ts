import { Component, Input } from '@angular/core';

import { FeatherIconComponent } from "../../../../shared/components/ui/feather-icon/feather-icon.component";
import { faqDetails } from '../../../../shared/data/faq';

@Component({
  selector: 'app-common-faq-details',
  imports: [FeatherIconComponent],
  templateUrl: './common-faq-details.component.html',
  styleUrl: './common-faq-details.component.scss'
})

export class CommonFaqDetailsComponent {
  
  @Input() details = faqDetails;

}
