import { Component, OnInit } from '@angular/core';
import { ITicket, TicketType, getTicketOrderString, getTicketStateString, getTicketTypeString } from 'src/app/Dashboard/ticket/ticket';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { StudentAuthService } from '../../../service/parent-student-auth.service';
import { TicketRepositoryService } from 'src/app/Dashboard/ticket/ticket-repository.service';
import { MessageService } from 'src/app/shared/services/message.service';

@Component({
    selector: 'app-tickets',
    templateUrl: './tickets.component.html',
    styleUrls: ['./tickets.component.scss']
})
export class TicketsComponent implements OnInit {

    page = 0;

    tickets: ITicket[] = [];

    search = "";
    search$ = new Subject<string>();

    onlyShowUnreads = false;

    totalItem = 0;

    isLoading = false;

    constructor(
        private ticketRep: TicketRepositoryService,
        private stdAuth: StudentAuthService,
        private message: MessageService
    ) { }

    ngOnInit() {
        this.refreshTickets();

        this.search$.pipe(
            debounceTime(400)
        ).subscribe(value => {
            this.refreshTickets(true);
        });
    }

    isAnyTickets(): boolean {
        if (!this.isLoading && this.tickets.length == 0 && this.search.length == 0) {
            return false;
        }

        return true;
    }

    searchChange() {
        this.search$.next();
    }

    canShowMoreButton(): boolean {
        var nowItemCount = this.tickets.length;
        var nowPage = this.page + 1;
        var totalItemCount = this.totalItem;

        if (nowItemCount < totalItemCount) {
            return true;
        }

        return false;
    }

    nextPage() {
        this.page += 1;

        this.refreshTickets();
    }

    getTicketOrderString(order) {
        return getTicketOrderString(order);
    }

    getTicketStateString(state) {
        return getTicketStateString(state);
    }

    getTicketTypeString(type) {
        return getTicketTypeString(type);
    }

    refreshTickets(clearListThenAdd = false) {
        this.isLoading = true;
        this.stdAuth.auth.post("/api/Ticket/Get", {
            getParam: {
                sort: "desc",
                direction: "id",
                pageIndex: this.page,
                pageSize: 5,
                q: this.search
            },
            id: this.stdAuth.getStudent().id,
            type: TicketType.StudentParent,
            onlyUnreads: this.onlyShowUnreads
        }, {
            type: 'View',
            agentId: this.stdAuth.getStudent().id,
            agentType: 'StudentParent',
            agentName: this.stdAuth.getStudentFullName(),
            tableName: 'Ticket List',
            logSource: 'PMA',
            object: {
                getParam: {
                    sort: "desc",
                    direction: "id",
                    pageIndex: this.page,
                    pageSize: 5,
                    q: this.search
                },
                id: this.stdAuth.getStudent().id,
                type: TicketType.StudentParent,
                onlyUnreads: this.onlyShowUnreads
            },
        }).subscribe(data => {
            if (data.success) {

                if (clearListThenAdd) {
                    this.tickets = [];
                }

                this.totalItem = +data.type;

                var tickets: ITicket[] = data.data.data;
                tickets.forEach(ticket => {
                    this.tickets.push(ticket);
                });

            } else {
                this.stdAuth.auth.message.showMessageforFalseResult(data);
            }

            this.isLoading = false;

        }, er => {
            this.stdAuth.auth.handlerError(er);
            this.isLoading = false;
        });
    }
    
    detectIsUserSender(ticket: ITicket): boolean {
        return this.ticketRep.detectIsSender(ticket, this.stdAuth.getStudent().id, TicketType.StudentParent);
    }

}
