import { Component, EventEmitter, Output } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { SvgIconComponent } from "../../../../shared/components/ui/svg-icon/svg-icon.component";
import { emailTypes } from '../../../../shared/data/email';

@Component({
  selector: 'app-mail-header',
  imports: [NgbDropdownModule, SvgIconComponent],
  templateUrl: './mail-header.component.html',
  styleUrl: './mail-header.component.scss'
})

export class MailHeaderComponent {

  @Output() emailType = new EventEmitter<string>();

  public emailTypes = emailTypes;
  public activeType: string = 'important';

  ngOnInit() {
    this.emailType.emit(this.activeType);
  }

  handleType(value: string) {
    this.activeType = value;
    this.emailType.emit(this.activeType);
  }
  
}
