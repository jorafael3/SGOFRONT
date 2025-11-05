import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPrintModule } from 'ngx-print';

import { FeatherIconComponent } from '../../../../shared/components/ui/feather-icon/feather-icon.component';
import { SvgIconComponent } from "../../../../shared/components/ui/svg-icon/svg-icon.component";
import { Emails } from '../../../../shared/interface/email';

@Component({
  selector: 'app-mail-details',
  imports: [AngularEditorModule, NgbTooltipModule, NgbDropdownModule,
            NgxPrintModule, SvgIconComponent , FeatherIconComponent],
  templateUrl: './mail-details.component.html',
  styleUrl: './mail-details.component.scss'
})

export class MailDetailsComponent {

  @Input() mailDetails: Emails;
  @Output() isMailOpen = new EventEmitter<boolean>();

  getUserText(userName: string): string {
    let names = userName.split(' ');
    return names.map(name => name[0]).join('');
  }

  getTextColor(name: string) {
    let firstLetter = name[0];

    if(firstLetter >= 'A' && firstLetter <= 'M') {
      return 'primary'
    } else {
      return 'success'
    }
  }

  goPrevious() {
    this.isMailOpen.emit(false);
  }

  addToFavorite(email: Emails) {
    email.is_favorite =! email.is_favorite;
  }
  
  print() {
    window.print()
  }
}
