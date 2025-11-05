import { Component, EventEmitter, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AddLabelModalComponent } from '../../../../shared/components/ui/modal/add-label-modal/add-label-modal.component';
import { SvgIconComponent } from "../../../../shared/components/ui/svg-icon/svg-icon.component";
import { emailSidebar, emailTags } from '../../../../shared/data/email';
import { ComposeEmailModalComponent } from '../compose-email-modal/compose-email-modal.component';

@Component({
  selector: 'app-sidebar',
  imports: [SvgIconComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})

export class SidebarComponent {

  @Output() currentTab = new EventEmitter<string>();

  public emailSidebar = emailSidebar;
  public emailTags = emailTags;
  public activeTab = 'inbox';

  constructor(private modal: NgbModal) {}

  ngOnInit() {
    this.currentTab.emit(this.activeTab);
  }

  handleTabChange(value: string) {
    this.activeTab = value;
    this.currentTab.emit(this.activeTab);
  }

  composeEmail(){
    this.modal.open(ComposeEmailModalComponent, { size: 'lg' })
  }

  openLabelModal() {
    this.modal.open(AddLabelModalComponent, { size: 'lg' })
  }
  
}
