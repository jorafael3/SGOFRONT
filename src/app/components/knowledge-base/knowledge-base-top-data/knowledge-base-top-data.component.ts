import { Component } from '@angular/core';

import { FeatherIconComponent } from "../../../shared/components/ui/feather-icon/feather-icon.component";
import { CommonFaqDetailsComponent } from "../../faq/widgets/common-faq-details/common-faq-details.component";
import { knowledgeBase } from '../../../shared/data/knowledge-base';

@Component({
  selector: 'app-knowledge-base-top-data',
  imports: [ FeatherIconComponent, CommonFaqDetailsComponent],
  templateUrl: './knowledge-base-top-data.component.html',
  styleUrl: './knowledge-base-top-data.component.scss'
})

export class KnowledgeBaseTopDataComponent {

  public knowledgeBase = knowledgeBase;

}
