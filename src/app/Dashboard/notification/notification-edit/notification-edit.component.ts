import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { INotification, getNotificationTypeString, getNotificationShowTypeString } from '../notification';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'src/app/shared/services/message.service';
import { AuthService, jsondata } from 'src/app/shared/Auth/auth.service';

@Component({
    selector: 'app-notification-edit',
    templateUrl: './notification-edit.component.html',
    styleUrls: ['./notification-edit.component.scss']
})
export class NotificationEditComponent implements OnInit, OnDestroy {
    Title: string;
    btnAddTitle: string;
    isEdit: boolean = false;

    PAGE_Data: INotification;

    oldData = null;

    PAGE_TITLE = "اعلامیه";
    PAGE_TITLES = "اعلانات";
    PAGE_APIURL = "Notification";
    PAGE_URL = "notification";

    @ViewChild("fm1", { static: false }) public fm1: NgForm;

    constructor(
        private route: Router,
        private activeRoute: ActivatedRoute,
        private message: MessageService,
        private auth: AuthService
    ) {
        activeRoute.params.subscribe(params => {
            this.activeRoute.data.subscribe(data => {
                this.PAGE_Data = data.notification;

                this.oldData = JSON.stringify(data.notification);
            });

            var id = params["id"];

            if (id === "0") {
                this.Title = "افزودن " + this.PAGE_TITLE;
                this.btnAddTitle = "افزودن";
                this.isEdit = false;
            } else {
                var idd = Number.parseInt(id);
                if (Number.isInteger(idd)) {
                    this.Title = "ویرایش " + this.PAGE_TITLE + this.PAGE_Data.title;
                    this.btnAddTitle = "ویرایش";
                    this.isEdit = true;
                } else {
                    this.message.showWarningAlert("invalid Data");
                    this.route.navigate(["/dashboard"]);
                }
            }
        });
    }

    
    ngOnDestroy(): void {
        let title = this.PAGE_APIURL;
        if (!this.fm1.submitted) {
            if (this.fm1.dirty) {
                this.auth.draft.setDraft({
                    title: title,
                    value: JSON.stringify(this.PAGE_Data)
                });
            }
        } else {
            if (!this.isEdit) {
                this.auth.draft.removeDraft(title)
            }
        }
    }

    sts() {
        if (this.fm1.valid) {
            if (this.isEdit) {
                this.auth.post("/api/" + this.PAGE_APIURL + "/Edit", this.PAGE_Data, {
                    type: 'Edit',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'Notification',
                    logSource: 'dashboard',
                    object: this.PAGE_Data,
                    oldObject: JSON.parse(this.oldData)
                }).subscribe(
                    (data: jsondata) => {
                        if (data.success) {
                            this.message.showSuccessAlert("با موفقیت ثبت شد");

                            this.route.navigate(["/dashboard/" + this.PAGE_URL]);
                        } else {
                            this.message.showMessageforFalseResult(data);
                        }
                    },
                    er => {
                        this.auth.handlerError(er);
                    }
                );
            } else {
                this.auth.post("/api/" + this.PAGE_APIURL + "/Add", this.PAGE_Data, {
                    type: 'Add',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName:'Notification',
                    logSource: 'dashboard',
                    object: this.PAGE_Data,
                }).subscribe(
                    (data: jsondata) => {
                        if (data.success) {
                            this.message.showSuccessAlert("با موفقیت ثبت شد");

                            this.route.navigate(["/dashboard/" + this.PAGE_URL]);
                        } else {
                            this.message.showMessageforFalseResult(data);
                        }
                    },
                    er => {
                        this.auth.handlerError(er);
                    }
                );
            }
        } else {
            this.message.showWarningAlert("مقادیر خواسته شده را تکمیل نمایید");
        }
    }

    getNotificationTypeString(type) {
        return getNotificationTypeString(type);
    }

    getNotificationShowTypeString(showType) {
        return getNotificationShowTypeString(showType);
    }

    ngOnInit() { }

}
