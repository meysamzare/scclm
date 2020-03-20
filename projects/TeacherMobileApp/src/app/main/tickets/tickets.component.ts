import { Component, OnInit } from '@angular/core';
import { ITicket, getTicketOrderString, getTicketStateString, getTicketTypeString, TicketType } from 'src/app/Dashboard/ticket/ticket';
import { Subject } from 'rxjs';
import { TicketRepositoryService } from 'src/app/Dashboard/ticket/ticket-repository.service';
import { StudentAuthService } from 'projects/ParentsMobileApp/src/app/service/parent-student-auth.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { debounceTime } from 'rxjs/operators';
import { TeacherAuthService } from '../../services/teacher-auth.service';

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
        private tchAuth: TeacherAuthService,
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

        var obj = {
            getParam: {
                sort: "desc",
                direction: "id",
                pageIndex: this.page,
                pageSize: 5,
                q: this.search
            },
            id: this.tchAuth.getTeacherId(),
            type: TicketType.Teacher,
            onlyUnreads: this.onlyShowUnreads
        };

        this.tchAuth.auth.post("/api/Ticket/Get", obj, {
            type: 'View',
            agentId: this.tchAuth.getTeacherId(),
            agentType: 'Teacher',
            agentName: this.tchAuth.getTeacherName(),
            tableName: 'View Ticket List (Get Param)',
            logSource: 'TMA',
            object: obj,
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
                this.tchAuth.auth.message.showMessageforFalseResult(data);
            }

            this.isLoading = false;

        }, er => {
            this.tchAuth.auth.handlerError(er);
            this.isLoading = false;
        });
    }

    detectIsUserSender(ticket: ITicket): boolean {
        return this.ticketRep.detectIsSender(ticket, this.tchAuth.getTeacherId(), TicketType.Teacher);
    }

}
