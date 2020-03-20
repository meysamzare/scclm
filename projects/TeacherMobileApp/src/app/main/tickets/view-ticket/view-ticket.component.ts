import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ITicket, ITicketConversation, TicketType, getTicketTypeString, getTicketStateString, getTicketOrderString } from 'src/app/Dashboard/ticket/ticket';
import { RoleClass } from 'src/app/Dashboard/role/role';
import { IUser } from 'src/app/Dashboard/user/user';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'src/app/shared/services/message.service';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { MatDialog } from '@angular/material';
import { TicketRepositoryService } from 'src/app/Dashboard/ticket/ticket-repository.service';
import { TeacherAuthService } from '../../../services/teacher-auth.service';

@Component({
    selector: 'app-view-ticket',
    templateUrl: './view-ticket.component.html',
    styleUrls: ['./view-ticket.component.scss']
})
export class ViewTicketComponent implements OnInit {

    isNew = false;
    isLoading = false;
    Title = "ارسال مکاتبه";

    Ticket: ITicket = new ITicket();
    Conversation: ITicketConversation = new ITicketConversation();

    conversations: ITicketConversation[] = [];

    roles: RoleClass[] = [];
    selectedRole: number = null;

    users: IUser[] = [];
    selectedUser: number = null;

    agentType = TicketType.Teacher;
    agentId = this.tchAuth.getTeacherId();

    constructor(
        private route: Router,
        private activeRoute: ActivatedRoute,
        private message: MessageService,
        public auth: AuthService,
        public tchAuth: TeacherAuthService,
        private dialog: MatDialog,
        private ticketRep: TicketRepositoryService,
        private location: Location
    ) {
        this.activeRoute.params.subscribe(params => {

            var id = params["id"];

            if (id === "0") {
                this.isNew = true;

                this.Conversation.isSender = true;

                this.Ticket.senderId = this.agentId;
                this.Ticket.senderType = this.agentType;

                this.Ticket.senderName = this.tchAuth.getTeacherName();

                this.auth.post("/api/Role/getAllHaveUser").subscribe(data => {
                    if (data.success) {
                        this.roles = data.data;
                    } else {
                        this.auth.message.showMessageforFalseResult(data);
                    }
                }, er => {
                    this.auth.handlerError(er);
                });

            } else {
                var idd = Number.parseInt(id);
                if (Number.isInteger(idd)) {
                    this.isNew = false;
                    this.Title = "مشاهده مکاتبه";

                    this.ticketRep.getTicket(id).subscribe(data => {
                        if (data.success) {
                            this.Ticket = data.data;

                            if (this.ticketRep.canUserViewTicket(this.Ticket, this.agentId, this.agentType)) {

                                this.ticketRep.setConversationsSeen(this.Ticket.id, !this.detectIsUserSender(), {
                                    type: 'Edit',
                                    agentId: this.tchAuth.getTeacherId(),
                                    agentType: 'Teacher',
                                    agentName: this.tchAuth.getTeacherName(),
                                    tableName: 'Set All Conversations Seen',
                                    logSource: 'TMA',
                                    object: {
                                        ticket: this.Ticket
                                    },
                                    oldObject: null
                                }).subscribe(data => {
                                    if (data.success) {
                                    } else {
                                        this.auth.message.showMessageforFalseResult(data);
                                    }
                                }, er => {
                                    this.auth.handlerError(er);
                                });


                                this.ticketRep.getConversationsForTicket(id, {
                                    type: 'View',
                                    agentId: this.tchAuth.getTeacherId(),
                                    agentType: 'Teacher',
                                    agentName: this.tchAuth.getTeacherName(),
                                    tableName: 'View Conversations For Ticket',
                                    logSource: 'TMA',
                                    object: {
                                        ticket: this.Ticket
                                    },
                                }).subscribe(data => {
                                    if (data.success) {
                                        this.conversations = data.data;


                                        this.conversations.forEach(conver => {
                                            conver.trustedContent = this.auth.getTrustedContent(conver.content);
                                        });
                                    } else {
                                        this.auth.message.showMessageforFalseResult(data);
                                    }
                                }, er => {
                                    this.auth.handlerError(er);
                                });

                            } else {
                                this.message.showErrorAlert("شما مجاز به دیدن این مکاتبه نیستید");
                                this.tchAuth.auth.logToServer({
                                    type: 'View',
                                    agentId: this.auth.getUserId(),
                                    agentType: 'User',
                                    agentName: this.auth.getUser().fullName,
                                    tableName: 'The Teacher Dosenot have Access To see The Ticket',
                                    logSource: 'dashboard',
                                    object: {
                                        ticket: this.Ticket
                                    },
                                });
                                this.location.back();
                            }


                        } else {
                            this.auth.message.showMessageforFalseResult(data);
                            this.location.back();
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
        });
    }



    ngOnInit() { }

    clearReciver() {
        this.Ticket.reciverId = null;
        this.Ticket.reciverName = null;
    }


    onFileChanged(event) {
        let reader = new FileReader();
        if (event.target.files && event.target.files.length > 0) {
            let file = event.target.files[0];
            if (file.size / 1024 / 1024 > 2) {
                return this.message.showWarningAlert(
                    "حجم فایل باید کمتر از 2 مگا بایت باشد",
                    "اخطار"
                );
            }
            reader.readAsDataURL(file);
            reader.onload = () => {
                let result = reader.result.toString().split(",")[1];
                this.Conversation.fileName = file.name;
                this.Conversation.fileData = result;
            };
        } else {
            this.Conversation.fileData = "";
            this.Conversation.fileName = "";
        }
    }

    clearFile() {
        this.Conversation.fileData = "";
        this.Conversation.fileName = "";
    }

    detectIsUserSender(): boolean {
        return this.ticketRep.detectIsSender(this.Ticket, this.agentId, this.agentType);
    }

    canUserRelpay(): boolean {
        var firstConversation = this.conversations[0];
        if (firstConversation) {
            return firstConversation.isSender == this.detectIsUserSender() ? false : true;
        }

        return true;
    }

    changeTicketState(state) {
        this.ticketRep.changeTicketState(this.Ticket.id, state).subscribe(data => {
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

    getNameAndTypeByConversation(conversation: ITicketConversation) {
        if (conversation.isSender) {
            return this.getSenderNameAndType();
        } else {
            return this.getReciverNameAndType();
        }
    }

    onRoleChange() {
        if (this.selectedRole) {

            this.users = [];
            this.selectedUser = null;

            this.clearReciver();

            this.auth.post("/api/User/getAllByRole", this.selectedRole).subscribe(data => {
                if (data.success) {
                    this.users = data.data;
                } else {
                    this.auth.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });
        }
    }

    onUserChange() {
        var user = this.users.find(c => c.id == this.selectedUser);

        if (user) {
            this.Ticket.reciverId = this.selectedUser;
            this.Ticket.reciverType = TicketType.User
            this.Ticket.reciverName = user.fullName;
        }
    }



    sts() {
        this.isLoading = true;
        if (this.isNew) {
            this.ticketRep.AddTicketWithConversation(this.Ticket, this.Conversation, {
                type: 'Add',
                agentId: this.tchAuth.getTeacherId(),
                agentType: 'Teacher',
                agentName: this.tchAuth.getTeacherName(),
                tableName: 'Send Ticket With Conversation',
                logSource: 'TMA',
                object: {
                    ticket: this.Ticket,
                    conversation: this.Conversation
                },
            }).subscribe(data => {
                if (data.success) {
                    this.message.showSuccessAlert();
                    this.location.back();
                } else {
                    this.auth.message.showMessageforFalseResult(data);
                    this.isLoading = false;
                }
            }, er => {
                this.auth.handlerError(er);
                this.isLoading = false;
            });
        } else {
            this.Conversation.isSender = this.detectIsUserSender();
            this.ticketRep.AddTicketConversation(this.Conversation, {
                type: 'Add',
                agentId: this.tchAuth.getTeacherId(),
                agentType: 'Teacher',
                agentName: this.tchAuth.getTeacherName(),
                tableName: 'Send Conversation in Ticket',
                logSource: 'TMA',
                object: {
                    ticket: this.Ticket,
                    conversation: this.Conversation
                },
            }).subscribe(data => {
                if (data.success) {
                    this.message.showSuccessAlert();
                    this.location.back();
                } else {
                    this.auth.message.showMessageforFalseResult(data);
                    this.isLoading = false;
                }
            }, er => {
                this.auth.handlerError(er);
                this.isLoading = false;
            });
        }
    }

}
