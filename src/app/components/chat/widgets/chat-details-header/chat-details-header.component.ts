import { Component, Input } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { SvgIconComponent } from "../../../../shared/components/ui/svg-icon/svg-icon.component";

import { RecentChats } from '../../../../shared/interface/chat';
import { ChatService } from '../../../../shared/services/chat.service';

@Component({
  selector: 'app-chat-details-header',
  imports: [NgbDropdownModule, SvgIconComponent],
  templateUrl: './chat-details-header.component.html',
  styleUrl: './chat-details-header.component.scss'
})

export class ChatDetailsHeaderComponent {

  @Input() currentUserChat: RecentChats;
  @Input() groupChat: boolean = false;

  constructor(public chatService: ChatService) {}

}
