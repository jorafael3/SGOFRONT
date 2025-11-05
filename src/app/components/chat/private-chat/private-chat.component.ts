import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { SvgIconComponent } from "../../../shared/components/ui/svg-icon/svg-icon.component";
import { ChatDetailsHeaderComponent } from "../widgets/chat-details-header/chat-details-header.component";
import { SidebarComponent } from '../widgets/sidebar/sidebar.component';

import { randomChats, recentChats } from '../../../shared/data/chat';
import { user } from '../../../shared/data/user';
import { RecentChats } from '../../../shared/interface/chat';

@Component({
  selector: 'app-private-chat',
  imports: [CommonModule, NgbDropdownModule, ReactiveFormsModule,
            SidebarComponent, ChatDetailsHeaderComponent, SvgIconComponent],
  templateUrl: './private-chat.component.html',
  styleUrl: './private-chat.component.scss'
})
export class PrivateChatComponent {

  @ViewChild('chat') private chatContainer: ElementRef;

  public userDetails = user;
  public recentChats = recentChats;
  public currentUserChat: RecentChats;
  public inputMessage: string = '';
  public chatForm = new FormGroup({
    inputMessage: new FormControl('')
  })

  handleChat(chat: RecentChats) {
    this.currentUserChat = chat;
  }

  handleKeyPress(event: any) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.handleMessage();
    }
  }

  handleMessage() {
    if(this.chatForm.value.inputMessage) {
      if(!this.currentUserChat.chats) {
        this.currentUserChat.chats = [];
      }
      this.currentUserChat.chats?.push({
        chat: this.chatForm.value.inputMessage,
        is_reply: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
      })
    }

    this.chatForm.controls['inputMessage'].setValue('');

    this.scrollToBottom();
    setTimeout(() => {
      this.getReply()
    }, 500);

    setTimeout(() => {
      if(this.currentUserChat.chats && this.currentUserChat.chats.length) {
        this.currentUserChat.last_message = this.currentUserChat.chats[this.currentUserChat.chats.length - 1]['chat']
        this.currentUserChat.message_time = this.currentUserChat.chats[this.currentUserChat.chats.length - 1]['time']
        this.currentUserChat.user_status = 'Online';
      }
      this.scrollToBottom();
    }, 500);
   
  }

  getReply() {
    const randomReply = randomChats[Math.floor(Math.random() * randomChats.length)];

    this.currentUserChat.chats?.push({
      chat: randomReply,
      is_reply: false,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
    })
  }

  private scrollToBottom() {
    setTimeout(() => {
      if (this.chatContainer) {
        this.chatContainer.nativeElement.scrollTo({
          top: this.chatContainer.nativeElement.scrollHeight,
          behavior: 'smooth'
        });
      }
    }, 100);
  }
}

