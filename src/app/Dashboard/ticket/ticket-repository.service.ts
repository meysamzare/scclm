import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { ITicketConversation, ITicket, TicketType } from './ticket';
import { ILogParam } from 'src/app/shared/Auth/log';

@Injectable({
    providedIn: 'root'
})
export class TicketRepositoryService {
    constructor(
        private auth: AuthService
    ) { }

    AddTicketConversation(conversation: ITicketConversation, log?: ILogParam) {
        return this.auth.post("/api/Ticket/AddConversation", conversation, log);
    }

    AddTicketWithConversation(ticket: ITicket, conversation: ITicketConversation, log?: ILogParam) {
        return this.auth.post("/api/Ticket/AddTicketWithConversation", {
            ticket: ticket,
            conversation: conversation
        }, log);
    }

    getTickets(userid, type: TicketType) {
        return this.auth.post("/api/Ticket/getTickets", {
            id: userid,
            type: type
        });
    }

    getTicket(id, log?: ILogParam) {
        return this.auth.post("/api/Ticket/getTicket", id, log);
    }

    getConversationsForTicket(ticketId, log?: ILogParam) {
        return this.auth.post("/api/Ticket/getConversations", ticketId, log);
    }

    getTopTenUnreadTickets(userid, type: TicketType) {
        return this.auth.post("/api/Ticket/getUnreadTickets", {
            id: userid,
            type: type
        });
    }

    getTopTenOpenTickets(userid, type: TicketType) {
        return this.auth.post("/api/Ticket/getOpenTickets", {
            id: userid,
            type: type
        });
    }

    getUnreadTicketsCount(userid, type: TicketType) {
        return this.auth.post("/api/Ticket/getUnreadTicketsCount", {
            id: userid,
            type: type
        });
    }

    detectIsSender(ticket: ITicket, usId, type: TicketType): boolean {
        if (ticket.senderId == usId && ticket.senderType == type) {
            return true;
        } else {
            return false;
        }
    }

    setConversationsSeen(ticketId, isSender, log?: ILogParam) {
        return this.auth.post("/api/Ticket/setAllConversationSeen", {
            ticketId: ticketId,
            isSender: isSender
        }, log);
    }

    changeTicketState(ticketId, state, log?: ILogParam) {
        return this.auth.post("/api/Ticket/changeState", {
            ticketId: ticketId,
            state: state
        }, log);
    }

    canUserViewTicket(ticket: ITicket, usId, type: TicketType): boolean {
        if (
            (ticket.senderId == usId && ticket.senderType == type) ||
            (ticket.reciverId == usId && ticket.reciverType == type)
        ) {
            return true;
        } else {
            return false;
        }
    }
}
