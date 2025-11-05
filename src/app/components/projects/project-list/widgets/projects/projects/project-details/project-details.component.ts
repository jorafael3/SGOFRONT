import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { SvgIconComponent } from '../../../../../../../shared/components/ui/svg-icon/svg-icon.component';
import { Projects } from '../../../../../../../shared/interface/project';
import { ChatService } from '../../../../../../../shared/services/chat.service';

@Component({
  selector: 'app-project-details',
  imports: [CommonModule, NgbTooltipModule, SvgIconComponent],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss'
})

export class ProjectDetailsComponent {

  @Input() project: Projects;

  constructor(public chatService: ChatService) {}

}
