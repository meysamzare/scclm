import { Component, OnInit } from "@angular/core";
import { MessageService } from "src/app/shared/services/message.service";
import { AuthService, jsondata } from "src/app/shared/Auth/auth.service";
import { ChatService } from "src/app/shared/services/chat.service";
import { IExam } from "../Exam/exam/exam";
import { ITicket, TicketType, getTicketOrderString, getTicketTypeString } from "../ticket/ticket";
import { TicketRepositoryService } from "../ticket/ticket-repository.service";
import { ISchedule } from "../WebSiteManagment/schedule/schedule";
import { MatDialog } from "@angular/material";
import { ExamDetailsComponent } from "./exam-details/exam-details.component";



@Component({
    templateUrl: './dashboard-home.component.html',
    styles: [`
        .mat-card-header-text { 
            margin: 0;
        }
        .widget {
            margin-top: 0;
            cursor: pointer;
        }

        
        .new-w {
            border-right-width: 8px;
            border-right-color: #fde900;
            border-right-style: inset;
        }
        
    `]
})
export class DashboardHomeComponent implements OnInit {

    upcommingExams: IExam[] = [];
    passedExams: IExam[] = [];
    waitingForResultExams: IExam[] = [];
    cancelledExams: IExam[] = [];

    upcommingExamsTotalCount = 0;
    passedExamsTotalCount = 0;
    waitingForResultExamsTotalCount = 0;
    cancelledExamsTotalCount = 0;

    openTickets: ITicket[] = [];
    unreadTickets: ITicket[] = [];

    firstTituteName = "....";
    activeYeareducationName = "....";
    registredStudentCountInActiveYeareducation = "....";
    ticketCount = "....";
    chatsCount = "....";

    upCommingSchedules: ISchedule[] = [];
    schedulesCount = 0;

    constructor(
        private message: MessageService,
        public auth: AuthService,
        public chat: ChatService,
        private ticketRep: TicketRepositoryService,
        private dialog: MatDialog
    ) { }

    ngOnInit(): void {
        if (this.auth.isUserAccess("view_Exam", false)) {

            this.auth.post("/api/Dashboard/getUpcommingExams").subscribe(data => {
                if (data.success) {
                    this.upcommingExams = data.data.exams;
                    this.upcommingExamsTotalCount = data.data.totalCount;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });

            this.auth.post("/api/Dashboard/getPassedExams").subscribe(data => {
                if (data.success) {
                    this.passedExams = data.data.exams;
                    this.passedExamsTotalCount = data.data.totalCount;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });

            this.auth.post("/api/Dashboard/getWaitingForResultExams").subscribe(data => {
                if (data.success) {
                    this.waitingForResultExams = data.data.exams;
                    this.waitingForResultExamsTotalCount = data.data.totalCount;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });

            this.auth.post("/api/Dashboard/getCancelledExams").subscribe(data => {
                if (data.success) {
                    this.cancelledExams = data.data.exams;
                    this.cancelledExamsTotalCount = data.data.totalCount;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });

        }

        this.ticketRep.getTopTenUnreadTickets(this.auth.getUserId(), TicketType.User).subscribe(data => {
            if (data.success) {
                this.unreadTickets = data.data;
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });

        this.ticketRep.getTopTenOpenTickets(this.auth.getUserId(), TicketType.User).subscribe(data => {
            if (data.success) {
                this.openTickets = data.data;
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });

        this.auth.post("/api/Dashboard/getFirstTituteName").subscribe(data => {
            if (data.success) {
                this.firstTituteName = data.data;
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });

        this.auth.post("/api/Dashboard/getActiveYeareducationName").subscribe(data => {
            if (data.success) {
                this.activeYeareducationName = data.data;
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });

        this.auth.post("/api/Dashboard/getRegistredStudentCountInActiveYeareducation").subscribe(data => {
            if (data.success) {
                this.registredStudentCountInActiveYeareducation = data.data;
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });

        this.auth.post("/api/Dashboard/getUpCommingSchedules").subscribe(data => {
            if (data.success) {
                this.upCommingSchedules = data.data.schedules;

                this.schedulesCount = data.data.totalCount;
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }

    getTicketOrderString(order) {
        return getTicketOrderString(order);
    }

    getTicketTypeString(type) {
        return getTicketTypeString(type);
    }

    openExamDetails(examId) {
        const dialog = this.dialog.open(ExamDetailsComponent, {
            data: {
                examId: examId
            }
        });
    }

}