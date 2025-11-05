import { Component, EventEmitter, Output } from '@angular/core';
import { NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Select2Module, Select2UpdateEvent } from 'ng-select2-component';

import { FeatherIconComponent } from "../../../../shared/components/ui/feather-icon/feather-icon.component";
import { AddTaskModalComponent } from '../add-task-modal/add-task-modal.component';
import { taskImportance, taskStatus } from '../../../../shared/data/tasks';
import { user } from '../../../../shared/data/user';

@Component({
  selector: 'app-sidebar',
  imports: [Select2Module, NgbDatepickerModule, FeatherIconComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})

export class SidebarComponent {

  @Output() selectedStatus = new EventEmitter();
  @Output() selectedImportance = new EventEmitter();

  public userDetails = user;
  public taskStatus = taskStatus;
  public taskImportance = taskImportance;
  public sidebarOpen: boolean = false;

  constructor(private modal: NgbModal) {}

  handleTaskStatus(event: Select2UpdateEvent) {
    const value = event.value;
    this.selectedStatus.emit(value);
  }

  handleImportance(event: Select2UpdateEvent) {
    const value = event.value;
    this.selectedImportance.emit(value);
  }

  openModal() {
    this.modal.open(AddTaskModalComponent, { size: 'lg' });
  }

  toggleFilter() {
    this.sidebarOpen =! this.sidebarOpen;
  }
  
}
