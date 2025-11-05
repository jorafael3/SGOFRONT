import { Component } from '@angular/core';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

import { FeatherIconComponent } from '../../../shared/components/ui/feather-icon/feather-icon.component';
import { FaqLatestUpdatesComponent } from "./faq-latest-updates/faq-latest-updates.component";
import { FaqNavigationComponent } from "./faq-navigation/faq-navigation.component";
import { FaqSearchArticlesComponent } from "./faq-search-articles/faq-search-articles.component";
import { faqQuestionAnswer } from '../../../shared/data/faq';

@Component({
  selector: 'app-faq-question-answer',
  imports: [NgbAccordionModule, FaqSearchArticlesComponent, FaqNavigationComponent, 
    FaqLatestUpdatesComponent, FeatherIconComponent],
  templateUrl: './faq-question-answer.component.html',
  styleUrl: './faq-question-answer.component.scss'
})

export class FaqQuestionAnswerComponent {

  public faqQuestionAnswer = faqQuestionAnswer;

}
