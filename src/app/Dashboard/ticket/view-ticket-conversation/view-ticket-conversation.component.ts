import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'src/app/shared/services/message.service';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { ITicket, ITicketConversation, TicketType, getTicketTypeString, getTicketStateString, getTicketOrderString } from '../ticket';
import { MatDialog } from '@angular/material';
import { SelectReciverUserModalComponent } from './modal/select-reciver-user-modal/select-reciver-user-modal.component';
import { TicketRepositoryService } from '../ticket-repository.service';
import { Location } from '@angular/common';

import '@ckeditor/ckeditor5-build-classic/build/translations/fa';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { DomSanitizer } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';

export class IReciver {
    reciverType: TicketType;
    reciverId: number;
    reciverName: string;

    reciverFullName: string;
}

@Component({
    selector: 'app-view-ticket-conversation',
    templateUrl: './view-ticket-conversation.component.html',
    styleUrls: ['./view-ticket-conversation.component.scss']
})
export class ViewTicketConversationComponent implements OnInit, OnDestroy {

    isNew = false;
    Title = "ارسال مکاتبه جدید";

    Ticket: ITicket = new ITicket();
    Conversation: ITicketConversation = new ITicketConversation();

    conversations: ITicketConversation[] = [];

    recivers: IReciver[] = [];
    reciverType: TicketType = TicketType.StudentParent;

    isSending = false;

    allSendingCount = 0;
    sendedCount = 0;
    precentSended = 0;

    @ViewChild("d1", { static: false }) public d1;

    public Editor = ClassicEditor;
    public config = {
        language: {
            ui: 'fa',
            content: 'en'
        }
    };

    @ViewChild("fm1", { static: false }) public fm1: NgForm;

    constructor(
        private route: Router,
        private activeRoute: ActivatedRoute,
        private message: MessageService,
        public auth: AuthService,
        private dialog: MatDialog,
        private ticketRep: TicketRepositoryService,
        private location: Location,
        private sanitizer: DomSanitizer,
    ) {
        this.activeRoute.params.subscribe(params => {

            var id = params["id"];

            if (id === "0") {
                this.isNew = true;

                this.Conversation.isSender = true;

                this.Ticket.senderId = this.auth.getUserId();
                this.Ticket.senderType = TicketType.User;

                this.Ticket.senderName = this.auth.getUser().fullName;
            } else {
                var idd = Number.parseInt(id);
                if (Number.isInteger(idd)) {
                    this.isNew = false;
                    this.Title = "مشاهده مکاتبه";

                    this.ticketRep.getTicket(id).subscribe(data => {
                        if (data.success) {
                            this.Ticket = data.data;

                            if (this.ticketRep.canUserViewTicket(this.Ticket, this.auth.getUserId(), TicketType.User)) {

                                this.ticketRep.setConversationsSeen(this.Ticket.id, !this.detectIsUserSender()).subscribe(data => {
                                    if (data.success) {
                                    } else {
                                        this.auth.message.showMessageforFalseResult(data);
                                    }
                                }, er => {
                                    this.auth.handlerError(er);
                                });


                                this.ticketRep.getConversationsForTicket(id, {
                                    type: 'View',
                                    agentId: this.auth.getUserId(),
                                    agentType: 'User',
                                    agentName: this.auth.getUser().fullName,
                                    tableName: 'View Ticket and the Conversations',
                                    logSource: 'dashboard',
                                    object: {
                                        ticket: this.Ticket
                                    },
                                    table: "Ticket",
                                    tableObjectIds: [id]
                                }).subscribe(data => {
                                    if (data.success) {
                                        this.conversations = data.data;

                                        this.conversations.forEach(conver => {
                                            conver.trustedContent = this.getTrustedContent(conver.content);
                                        })
                                    } else {
                                        this.auth.message.showMessageforFalseResult(data);
                                    }
                                }, er => {
                                    this.auth.handlerError(er);
                                });

                            } else {
                                this.message.showErrorAlert("شما مجاز به دیدن این مکاتبه نیستید");
                                this.location.back();
                            }

                        } else {
                            this.auth.message.showMessageforFalseResult(data);
                        }
                    }, er => {
                        this.auth.handlerError(er);
                    });


                    this.Conversation.ticketId = id;


                } else {
                    this.message.showWarningAlert("invalid Data");
                    this.route.navigate(["/dashboard"]);
                }
            }
        })
    }

    ngOnDestroy(): void {
        let title = "ticket";
        // console.log({ fm1: this.fm1 });
        if (!this.fm1.submitted) {
            if (this.fm1.dirty) {
                this.auth.draft.setDraft({
                    title: title,
                    value: JSON.stringify({
                        ticket: this.Ticket,
                        conversation: this.Conversation,
                        recivers: this.recivers
                    })
                });
            }
        } else {
            if (this.isNew) {
                this.auth.draft.removeDraft(title)
            }
        }
    }

    async ngOnInit() {
        if (this.isNew) {
            let title = "ticket";
            if (await this.auth.draft.isAnyDraft(title)) {
                let ticketObj = JSON.parse((await this.auth.draft.getDraft(title)).value);

                this.Ticket = ticketObj.ticket
                this.Conversation = ticketObj.conversation
                this.recivers = ticketObj.recivers
            }
        }
    }

    goBack() {
        this.route.navigateByUrl("/dashboard/ticket/conversations");
    }

    getTrustedContent(content: string) {
        return this.sanitizer.bypassSecurityTrustHtml(content);
    }

    openSelectionModal() {
        var dialog = this.dialog.open(SelectReciverUserModalComponent, {
            data: {
                type: this.reciverType
            }
        });

        dialog.afterClosed().subscribe(data => {
            if (data) {

                var reciver = this.recivers.find(c => c.reciverId == data.id && c.reciverType == this.reciverType);
                var self = this.recivers.find(c => c.reciverId == this.auth.getUserId() && c.reciverType == TicketType.User);
                if (reciver || self) {
                    return;
                }

                this.recivers.push({
                    reciverId: data.id,
                    reciverName: data.name,
                    reciverType: this.reciverType,
                    reciverFullName: this.getTicketTypeString(this.reciverType) + ' ' + data.name
                });
            }
        });
    }

    removeReciver(reciver: IReciver) {
        this.recivers.splice(this.recivers.findIndex(c => c == reciver), 1);
    }

    clearReciver() {
        this.Ticket.reciverId = null;
        this.Ticket.reciverName = null;
    }


    setFile(files: File[]) {

        files.forEach(file => {
            if (file.size / 1024 / 1024 > 2) {
                this.d1.reset();
                return this.message.showWarningAlert(
                    "حجم فایل باید کمتر از " + " دو مگابایت " + " باشد",
                    "اخطار"
                );
            }
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e: ProgressEvent) => {
                let result = reader.result.toString().split(",")[1];

                this.Conversation.fileData = result;
                this.Conversation.fileName = file.name;
            };
        });
    }

    removeFile() {
        this.d1.reset();
        this.Conversation.fileData = "";
        this.Conversation.fileName = "";
    }

    detectIsUserSender(): boolean {
        return this.ticketRep.detectIsSender(this.Ticket, this.auth.getUserId(), TicketType.User);
    }

    canUserRelpay(): boolean {
        var firstConversation = this.conversations[0];
        if (firstConversation) {
            return firstConversation.isSender == this.detectIsUserSender() ? false : true;
        }

        return true;
    }

    changeTicketState(state) {
        this.ticketRep.changeTicketState(this.Ticket.id, state, {
            type: 'Edit',
            agentId: this.auth.getUserId(),
            agentType: 'User',
            agentName: this.auth.getUser().fullName,
            tableName: 'Change Ticket State',
            logSource: 'dashboard',
            object: {
                ticketId: this.Ticket.id,
                newState: state
            },
            oldObject: {
                ticketId: this.Ticket.id,
                oldState: this.Ticket.state
            },
            table: "Ticket",
            tableObjectIds: [this.Ticket.id]
        }).subscribe(data => {
            if (data.success) {
                this.Ticket.state = state;
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }


    getSenderNameAndType() {
        return getTicketTypeString(this.Ticket.senderType) + " " + this.Ticket.senderName;
    }

    getReciverNameAndType() {
        return getTicketTypeString(this.Ticket.reciverType) + " " + this.Ticket.reciverName;
    }

    getTicketStateString() {
        return getTicketStateString(this.Ticket.state);
    }

    getTicketOrderString() {
        return getTicketOrderString(this.Ticket.order);
    }

    getOrderString(order) {
        return getTicketOrderString(order);
    }

    getTicketTypeString(type: TicketType) {
        return getTicketTypeString(type);
    }

    getNameAndTypeByConversation(conversation: ITicketConversation) {
        if (conversation.isSender) {
            return this.getSenderNameAndType();
        } else {
            return this.getReciverNameAndType();
        }
    }

    sts() {
        if (this.isNew) {

            this.recivers.forEach((reciver, index) => {

                this.isSending = true;

                this.allSendingCount = this.recivers.length;

                var reciverCount = this.recivers.length - 1;

                this.Ticket.reciverId = reciver.reciverId;
                this.Ticket.reciverType = reciver.reciverType;
                this.Ticket.reciverName = reciver.reciverName;

                this.ticketRep.AddTicketWithConversation(this.Ticket, this.Conversation, {
                    type: 'Add',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'Ticket With One Conversation',
                    logSource: 'dashboard',
                    object: {
                        ticket: this.Ticket,
                        conversation: this.Conversation
                    },
                    table: "Ticket",
                    tableObjectIds: [this.Ticket.id]
                }).subscribe(data => {
                    var isLastReciver = index == reciverCount;

                    if (data.success) {
                        if (isLastReciver) {
                            this.message.showSuccessAlert();
                            this.route.navigate(["/dashboard/ticket/conversations"]);
                        }
                    } else {
                        this.auth.message.showMessageforFalseResult(data);
                    }
                }, er => {
                    this.auth.handlerError(er);
                }, () => {
                    this.sendedCount = index + 1;
                    this.precentSended = (100 * this.sendedCount / this.allSendingCount);
                });

            });

        } else {
            this.Conversation.isSender = this.ticketRep.detectIsSender(this.Ticket, this.auth.getUserId(), TicketType.User);
            this.ticketRep.AddTicketConversation(this.Conversation, {
                type: 'Add',
                agentId: this.auth.getUserId(),
                agentType: 'User',
                agentName: this.auth.getUser().fullName,
                tableName: 'Conversation For Ticket',
                logSource: 'dashboard',
                object: {
                    conversation: this.Conversation
                },
                table: "Ticket",
                tableObjectIds: [this.Ticket.id]
            }).subscribe(data => {
                if (data.success) {
                    this.message.showSuccessAlert();
                    this.route.navigate(["/dashboard/ticket/conversations"]);
                } else {
                    this.auth.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });
        }
    }

}