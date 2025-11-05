import { Component } from '@angular/core';

import { ticketListStatus } from '../../../shared/data/support-ticket';

@Component({
  selector: 'app-support-ticket-list',
  imports: [],
  templateUrl: './support-ticket-list.component.html',
  styleUrl: './support-ticket-list.component.scss'
})

export class SupportTicketListComponent {

  public ticketListStatus = ticketListStatus;

}
